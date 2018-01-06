import {
  call,
  put,
  fork,
  select,
  all,
  takeLatest,
} from 'redux-saga/effects'
import {
  GET_ETHEREUM,
} from '../actions/constants'

import { setupRegistry, setupContract } from '../contracts'

import {
  setEthjs,
  contractError,
  setContracts,
} from '../actions'
import {
  selectEthjs,
  selectAccount,
} from '../selectors'

import registrySaga from './registry'
import tokenSaga, { tokensAllowedSaga } from './token'
import votingSaga from './voting'

import { getEthjs } from '../libs/provider'

export default function* rootSaga() {
  yield takeLatest(GET_ETHEREUM, genesis)
  yield fork(registrySaga)
  yield fork(tokenSaga)
  yield fork(votingSaga)
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
    const account = yield select(selectAccount)
    const registry = yield call(setupRegistry, eth, account)

    const [ token, parameterizer, voting ] = yield all([
      call(setupContract, eth, account, registry.contract, 'Token'),
      call(setupContract, eth, account, registry.contract, 'Parameterizer'),
      call(setupContract, eth, account, registry.contract, 'Voting'),
    ])
    // token.contract.abi = false
    // registry.contract.abi = false
    // parameterizer.contract.abi = false
    // voting.contract.abi = false

    yield put(
      setContracts({
        registry,
        token,
        parameterizer,
        voting,
      })
    )

    // Gets tokens allowed
    yield fork(tokensAllowedSaga)
  } catch (err) {
    yield put(contractError(err))
  }
}
