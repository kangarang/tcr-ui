import {
  call,
  put,
  select,
  takeEvery,
} from 'redux-saga/effects'
import {
  setTokensAllowed,
  contractError,
} from '../actions'
import {
  GET_TOKENS_ALLOWED,
  TX_APPROVE,
} from '../actions/constants'
import {
  selectAccount,
  makeSelectContract,
  selectRegistry,
} from '../selectors'

export default function* tokenSaga() {
  yield takeEvery(GET_TOKENS_ALLOWED, tokensAllowedSaga)
  yield takeEvery(TX_APPROVE, approvalSaga)
}

// Token interactions
// Approve Registry
export function* approvalSaga(payload) {
  const registry = yield select(selectRegistry)
  const token = yield select(makeSelectContract('token'))
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
  const account = yield select(selectAccount)
  const registry = yield select(selectRegistry)
  const token = yield select(makeSelectContract('token'))
  try {
    const allowed = yield call(token.allowance, account, registry.address)
    yield put(setTokensAllowed(allowed))
  } catch (err) {
    console.log('Allowance error:', err)
    yield put(contractError(err))
  }
}