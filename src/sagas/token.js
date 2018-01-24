import { call, put, select, takeLatest } from 'redux-saga/effects'
import { setTokensAllowed, contractError } from '../actions'
import { GET_TOKENS_ALLOWED } from '../actions/constants'
import { selectAccount } from '../selectors'
import { getContract } from '../services'

export default function* tokenSaga() {
  yield takeLatest(GET_TOKENS_ALLOWED, tokensAllowedSaga)
}

export function* tokensAllowedSaga(spender) {
  const address = yield select(selectAccount)
  const token = yield call(getContract, 'token')
  try {
    // TODO: use udapp instead
    const { allowance, balance } = yield call(token.allowance, address, spender)
    yield put(setTokensAllowed({ spender, allowance, balance }))
  } catch (err) {
    console.log('Allowance error:', err)
    yield put(contractError(err))
  }
}