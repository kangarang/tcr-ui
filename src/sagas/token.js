import { call, put, select, takeLatest } from 'redux-saga/effects'
import { setTokensAllowed, contractError } from '../actions'
import { GET_TOKENS_ALLOWED } from '../actions/constants'
import { selectAccount } from '../selectors'
import { getContract } from '../services'
import { fromToken } from '../libs/units'

export default function* tokenSaga() {
  yield takeLatest(GET_TOKENS_ALLOWED, updateTokenBalancesSaga)
}

export function* updateTokenBalancesSaga(spender) {
  const address = yield select(selectAccount)
  const token = yield call(getContract, 'token')
  const voting = yield call(getContract, 'voting')
  try {
    // TODO: use udapp instead
    const { allowance, balance } = yield call(token.allowance, address, spender)
    const votingRights = yield call(
      [voting.contract, 'voteTokenBalance', 'call'],
      address
    )
    const tokenVotingRights = fromToken(votingRights, token.decimalPower)
    yield put(
      setTokensAllowed({
        spender,
        allowance,
        balance,
        votingRights,
        tokenVotingRights,
      })
    )
  } catch (err) {
    console.log('Allowance error:', err)
    yield put(contractError(err))
  }
}
