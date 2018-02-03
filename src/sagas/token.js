import { call, put, select, takeEvery } from 'redux-saga/effects'
import { setTokensAllowed, contractError } from '../actions'
import { GET_TOKENS_ALLOWED } from '../actions/constants'
import {
  selectAccount,
  selectParameters,
  selectToken,
  selectVoting,
} from '../selectors'
import value_utils from '../utils/value_utils'

export default function* tokenSaga() {
  // yield takeEvery(GET_TOKENS_ALLOWED, updateTokenBalancesSaga)
}

export function* updateTokenBalancesSaga(spender) {
  const owner = yield select(selectAccount)
  const token = yield select(selectToken)
  const voting = yield select(selectVoting)

  try {
    const tokenBalance = yield call(token.contract.balanceOf.call, owner)
    const tokensAllowed = yield call(
      token.contract.allowance.call,
      owner,
      spender
    )
    const votingRights = yield call(
      voting.contract.voteTokenBalance.call,
      owner
    )
    const balance = value_utils
      .toUnitAmount(tokenBalance, token.decimalPower)
      .toString(10)

    const allowance = value_utils
      .toUnitAmount(tokensAllowed, token.decimalPower)
      .toString(10)

    const parameters = yield select(selectParameters)

    const minDeposit = parameters.get('minDeposit')

    const prerequisites = allowance < minDeposit

    yield put(
      setTokensAllowed({
        spender,
        allowance,
        balance,
        votingRights,
        prerequisites,
      })
    )
  } catch (err) {
    console.log('Allowance error:', err)
    yield put(contractError(err))
  }
}

// function* allowanceSaga(owner, spender) {
//   const ethjs = yield select(selectEthjs)
//   const token = yield select(selectContract('token'))
//   const boABI = yield call(getMethodAbi, token.address, 'balanceOf', token.contract.abi)
//   const txData = yield call(EthAbi.encodeMethod, boABI, [owner])
//   const payload = {
//     from: account,
//     to: token.address,
//     data: txData,
//   }
//   const tokenBalance = yield call(ethjs.call, payload, 'latest')

//   const balance = value_utils
//     .toUnitAmount(BN(tokenBalance), token.decimalPower)
//     .toString(10)
// }
