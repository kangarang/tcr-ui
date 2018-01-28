import { call, put, select, takeLatest } from 'redux-saga/effects'
import { setTokensAllowed, contractError } from '../actions'
import { GET_TOKENS_ALLOWED } from '../actions/constants'
import { selectAccount } from '../selectors'
import { getContract } from '../services'
import value_utils from '../utils/value_utils';

export default function* tokenSaga() {
  yield takeLatest(GET_TOKENS_ALLOWED, updateTokenBalancesSaga)
}

export function* updateTokenBalancesSaga(spender) {
  const address = yield select(selectAccount)
  const token = yield call(getContract, 'token')
  const voting = yield call(getContract, 'voting')
  try {
    // TODO: set up this function after you set up the txn conversions
    let { allowance, balance } = yield call(token.allowance, address, spender)
    let votingRights = yield call(
      [voting.contract, 'voteTokenBalance', 'call'],
      address
    )

    // TODO: set up these helpers after you set up the txn conversions
    allowance = value_utils.toUnitAmount(allowance, token.decimals)
    balance = value_utils.toUnitAmount(balance, token.decimals)

    yield put(
      setTokensAllowed({
        spender,
        allowance,
        balance,
        votingRights,
      })
    )
  } catch (err) {
    console.log('Allowance error:', err)
    yield put(contractError(err))
  }
}