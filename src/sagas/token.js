import { call, put, select, all, takeEvery } from 'redux-saga/effects'
import { updateBalances } from '../actions'
import { UPDATE_BALANCES_REQUEST } from '../actions/constants'
import {
  selectEthjs,
  selectAccount,
  selectRegistry,
  selectToken,
  selectVoting,
} from '../selectors'
import { toUnitAmount, toEther } from '../utils/units_utils'

export default function* tokenSaga() {
  yield takeEvery(UPDATE_BALANCES_REQUEST, updateBalancesSaga)
}

function* updateBalancesSaga() {
  try {
    const ethjs = yield select(selectEthjs)
    const owner = yield select(selectAccount)
    const registry = yield select(selectRegistry)
    const token = yield select(selectToken)
    const voting = yield select(selectVoting)

    const [
      ethBalance,
      tokenBalanceRaw,
      registryAllowanceRaw,
      votingAllowanceRaw,
      votingRightsRaw,
    ] = yield all([
      call(ethjs.getBalance, owner),
      call(token.contract.balanceOf.call, owner),
      call(token.contract.allowance.call, owner, registry.address),
      call(token.contract.allowance.call, owner, voting.address),
      call(voting.contract.voteTokenBalance.call, owner),
    ])

    const ETH = toEther(ethBalance)
    const tokenBalance = toUnitAmount(
      tokenBalanceRaw,
      token.decimalPower
    ).toString(10)
    const registryAllowance = toUnitAmount(
      registryAllowanceRaw,
      token.decimalPower
    ).toString(10)
    const votingAllowance = toUnitAmount(
      votingAllowanceRaw,
      token.decimalPower
    ).toString(10)
    const votingRights = toUnitAmount(votingRightsRaw, 18).toString(10)

    yield put(
      updateBalances({
        balances: {
          ETH,
          token: tokenBalance,
          registryAllowance,
          votingAllowance,
          votingRights,
          voterReward: '0',
        },
      })
    )
  } catch (err) {
    console.log('Update balances error:', err)
  }
}
