import {
  call,
  put,
  select,
  // takeEvery,
} from 'redux-saga/effects'
import {
  setTokensAllowed,
  contractError,
} from '../actions'
import {
  // GET_TOKENS_ALLOWED,
} from '../actions/constants'
import {
  selectAccount,
} from '../selectors'
import { getContract } from '../services';
// import { getEthjs } from '../libs/provider';

export default function* tokenSaga() {
  // yield takeEvery(GET_TOKENS_ALLOWED, tokensAllowedSaga)
}

// Gets Token-Contract allowance
export function* tokensAllowedSaga(allowedContractAddress) {
  // const eth = yield call(getEthjs)
  const address = yield select(selectAccount)
  const token = yield call(getContract, 'token')
  try {
    // TODO: use udapp instead
    const { allowance, balance } = yield call(token.allowance, address, allowedContractAddress)
    yield put(setTokensAllowed({ allowedContractAddress, allowance, balance }))
  } catch (err) {
    console.log('Allowance error:', err)
    yield put(contractError(err))
  }
}