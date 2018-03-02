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
import { toUnitAmount } from '../utils/units_utils'

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

    const [ethBalance, tokenBalanceRaw, registryAllowanceRaw, votingAllowanceRaw, votingRightsRaw] = yield all([
      call(ethjs.getBalance, owner),
      call(token.contract.balanceOf.call, owner),
      call(token.contract.allowance.call, owner, registry.address),
      call(token.contract.allowance.call, owner, voting.address),
      call(voting.contract.voteTokenBalance.call, owner)
    ])

    const tokenBalance = toUnitAmount(tokenBalanceRaw, token.decimalPower).toString(10)
    const registryAllowance = toUnitAmount(registryAllowanceRaw, token.decimalPower).toString(10)
    const votingAllowance = toUnitAmount(votingAllowanceRaw, token.decimalPower).toString(10)
    const votingRights = toUnitAmount(votingRightsRaw, 18).toString(10)

    // const ethBalance = yield call(ethjs.getBalance, owner)

    // const tokenBalanceRaw = yield call(token.contract.balanceOf.call, owner)
    // const tokenBalance = toUnitAmount(tokenBalanceRaw, token.decimalPower).toString(10)

    // const registryAllowanceRaw = yield call(token.contract.allowance.call, owner, registry.address)
    // const registryAllowance = toUnitAmount(registryAllowanceRaw, token.decimalPower).toString(10)

    // const votingAllowanceRaw = yield call(token.contract.allowance.call, owner, voting.address)
    // const votingAllowance = toUnitAmount(votingAllowanceRaw, token.decimalPower).toString(10)

    // const votingRightsRaw = yield call(voting.contract.voteTokenBalance.call, owner)
    // const votingRights = toUnitAmount(votingRightsRaw, 18).toString(10)

    yield put(
      updateBalances({
        balances: {
          ETH: ethBalance,
          token: tokenBalance,
          registryAllowance,
          votingAllowance,
          votingRights,
        }
      })
    )
  } catch (err) {
    console.log('Update balances error:', err)
  }
}