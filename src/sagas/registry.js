import {
  call,
  put,
  select,
  all,
  spawn,
  fork,
  takeLatest,
  takeEvery,
} from 'redux-saga/effects'
import {
  GET_TOKENS_ALLOWED,
  TX_APPROVE,
  TX_APPLY,
  TX_CHALLENGE,
  TX_COMMIT_VOTE,
  TX_UPDATE_STATUS,
  TX_CHECK_TEST,
} from '../actions/constants'

import {
  contractError,
  setTokensAllowed,
  statusUpdate,
} from '../actions'
import {
  selectEthjs,
  selectAccount,
  makeSelectContract,
  selectRegistry,
} from '../selectors'

import eventsSaga from './events'
import logsSaga from './logs'
import { tokensAllowedSaga, approvalSaga } from './token'

import { getEthjs } from '../libs/provider'
import { toNineToken } from '../libs/units';

export default function* registrySaga() {
  yield fork(eventsSaga)

  yield spawn(logsSaga)

  yield takeEvery(GET_TOKENS_ALLOWED, tokensAllowedSaga)

  yield takeEvery(TX_APPROVE, approvalSaga)
  yield takeEvery(TX_APPLY, applicationSaga)
  yield takeEvery(TX_CHALLENGE, challengeSaga)
  yield takeEvery(TX_UPDATE_STATUS, updateStatusSaga)
  yield takeEvery(TX_CHECK_TEST, checkTestSaga)
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

// Gets Token-Registry allowance
// export function* tokensAllowedSaga() {
//   const token = yield select(makeSelectContract('token'))
//   const account = yield select(selectAccount)
//   const registry = yield select(makeSelectContract('registry'))
//   try {
//     const allowed = yield call(token.allowance, account, registry.address)
//     yield put(setTokensAllowed(allowed))
//   } catch (err) {
//     console.log('Allowance error:', err)
//     yield put(contractError(err))
//   }
// }
