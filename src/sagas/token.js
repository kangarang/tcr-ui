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
} from '../selectors'
import { getContract, getRegistry } from '../services';
import { getEthjs } from '../libs/provider';

export default function* tokenSaga() {
  yield takeEvery(GET_TOKENS_ALLOWED, tokensAllowedSaga)
  yield takeEvery(TX_APPROVE, approvalSaga)
}

// Token interactions
// Approve Registry
export function* approvalSaga(payload) {
  const eth = yield call(getEthjs)
  const address = yield select(selectAccount)
  const registry = yield call(getRegistry, eth, address)
  const token = yield call(getContract, 'token')
  try {
    const { approval, allowance, balance } = yield call(token.approve, registry.address, payload.amount, address)
    console.log('approval', approval)
    const allowedContractAddress = registry.address
    yield put(setTokensAllowed({ allowedContractAddress, allowance, balance }))
  } catch (err) {
    console.log('Approval error:', err)
    yield put(contractError(err))
  }
}

// // Gets Token-Registry allowance
export function* tokensAllowedSaga(allowedContractAddress) {
  const eth = yield call(getEthjs)
  const address = yield select(selectAccount)
  // const registry = yield call(getRegistry, eth, address)
  const token = yield call(getContract, 'token')
  try {
    const { allowance, balance } = yield call(token.allowance, address, allowedContractAddress)
    yield put(setTokensAllowed({ allowedContractAddress, allowance, balance }))
  } catch (err) {
    console.log('Allowance error:', err)
    yield put(contractError(err))
  }
}