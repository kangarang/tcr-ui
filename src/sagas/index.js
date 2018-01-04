import {
  call,
  put,
  fork,
  select,
  all,
  spawn,
  takeLatest,
  takeEvery,
} from 'redux-saga/effects'
import {
  GET_ETHEREUM,
  GET_TOKENS_ALLOWED,
  SET_CONTRACTS,
  TX_APPROVE,
  TX_APPLY,
  TX_CHALLENGE,
  TX_COMMIT_VOTE,
  TX_UPDATE_STATUS,
  TX_CHECK_TEST,
} from '../constants'

import { setupRegistry, setupContracts } from '../contracts'

import {
  setEthjs,
  contractError,
  setContracts,
  setMinDeposit,
  setTokensAllowed,
  statusUpdate,
} from '../actions'
import {
  selectEthjs,
  makeSelectAccount,
  makeSelectContract,
  selectRegistry,
} from '../selectors'

import { setupEventChannels } from './events'
import logsSaga from './logs'

import { getEthjs } from '../libs/provider'
import { toNineToken } from '../libs/units';

export default function* rootSaga() {
  yield takeLatest(GET_ETHEREUM, genesis)
  yield takeLatest(SET_CONTRACTS, setupEventChannels)

  yield spawn(logsSaga)

  yield takeEvery(GET_TOKENS_ALLOWED, tokensAllowedSaga)

  yield takeEvery(TX_APPROVE, approvalSaga)
  yield takeEvery(TX_APPLY, applicationSaga)
  yield takeEvery(TX_CHALLENGE, challengeSaga)
  yield takeEvery(TX_COMMIT_VOTE, commitSaga)
  yield takeEvery(TX_UPDATE_STATUS, updateStatusSaga)
  yield takeEvery(TX_CHECK_TEST, checkTestSaga)
}

function* genesis() {
  try {
    const eth = yield call(getEthjs)

    const account = yield call(eth.coinbase)
    const [blockNumber, ethBalance, network] = yield all([
      call(eth.blockNumber),
      call(eth.getBalance, account),
      call(eth.net_version),
    ])
    console.log('account', account)
    console.log('network', network)
    yield put(setEthjs(eth, { account, ethBalance, blockNumber, network }))
    yield fork(contractsSaga)
  } catch (err) {
    yield put(contractError(err))
  }
}

// Sets up contracts
function* contractsSaga() {
  try {
    const eth = yield select(selectEthjs)
    const account = yield select(makeSelectAccount())

    const registry = yield call(setupRegistry, eth, account)
    const { token, parameterizer, voting } = yield call(
      setupContracts,
      eth,
      account,
      registry.contract
    )

    yield put(
      setContracts({
        registry,
        token,
        parameterizer,
        voting,
      })
    )
    // Sets canonical MIN_DEPOSIT
    yield put(setMinDeposit(parameterizer.minDeposit))
    // Gets tokens allowed
    yield fork(tokensAllowedSaga)
  } catch (err) {
    yield put(contractError(err))
  }
}

// Registry interactions
// Apply
function* applicationSaga(payload) {
  const registry = yield select(makeSelectContract('registry'))
  const token = yield select(makeSelectContract('token'))

  try {
    yield call(
      registry.applyDomain,
      payload.domain,
      payload.deposit,
      token.decimalPower
    )
    yield call(tokensAllowedSaga)
  } catch (err) {
    console.log('Apply error:', err)
    yield put(contractError(err))
  }
}

// Challenge
function* challengeSaga(payload) {
  const registry = yield select(makeSelectContract('registry'))
  try {
    yield call(registry.challengeDomain, payload.domain)
    yield call(tokensAllowedSaga)
  } catch (err) {
    console.log('Challenge error:', err)
    yield put(contractError(err))
  }
}

// Commit vote
function* commitSaga(payload) {
  const token = yield select(makeSelectContract('token'))
  const voting = yield select(makeSelectContract('voting'))
  const account = yield select(makeSelectAccount())


  try {
    yield call(token.approve, voting.address, payload.amount)
    yield call(voting.requestVotingRights, payload.amount)

    const receipt = yield call(voting.commitVote, payload.pollID, account, payload.amount)
    console.log('receipt', receipt)
  } catch (err) {
    console.log('Commit vote error:', err)
    yield put(contractError(err))
  }
  yield call(tokensAllowedSaga)
}

function* checkTestSaga(payload) {
  const registry = yield select(selectRegistry)
  // const receipt = yield call([registry, 'checkCall'], 'isWhitelisted', payload.domain)
  const receipt = yield call([registry, 'checkCall'], 'challengeExists', payload.domain)
  console.log('receipt', receipt)
  // yield put(statusUpdate(payload.domain, receipt))
}

function* updateStatusSaga(payload) {
  const registry = yield select(selectRegistry)
  const receipt = yield call(registry.updateStatus, payload.domain)
  yield put(statusUpdate(payload.domain, receipt))
}

// Token interactions
// Approve Registry
export function* approvalSaga(payload) {
  const token = yield select(makeSelectContract('token'))
  const registry = yield select(makeSelectContract('registry'))
  try {
    yield call(token.approve, registry.address, payload.amount)
    yield call(tokensAllowedSaga)
  } catch (err) {
    console.log('Approval error:', err)
    yield put(contractError(err))
  }
}

// Gets Token-Registry allowance
export function* tokensAllowedSaga() {
  const token = yield select(makeSelectContract('token'))
  const account = yield select(makeSelectAccount())
  const registry = yield select(makeSelectContract('registry'))
  try {
    const allowed = yield call(token.allowance, account, registry.address)
    yield put(setTokensAllowed(allowed))
  } catch (err) {
    console.log('Allowance error:', err)
    yield put(contractError(err))
  }
}
