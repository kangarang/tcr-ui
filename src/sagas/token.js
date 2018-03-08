import { call, put, select, all, takeEvery } from 'redux-saga/effects'
import { updateBalances } from '../actions'
import { UPDATE_BALANCES_REQUEST } from '../actions/constants'
import {
  selectEthjs,
  selectAccount,
  selectRegistry,
  selectToken,
  selectVoting,
  selectAllContracts,
} from '../selectors'
import { baseToConvertedUnit, toEther } from '../utils/_units'

export default function* tokenSaga() {
  yield takeEvery(UPDATE_BALANCES_REQUEST, updateBalancesSaga)
}

// TODO: tests
function* updateBalancesSaga() {
  try {
    const ethjs = yield select(selectEthjs)
    const owner = yield select(selectAccount)
    const registry = yield select(selectRegistry)
    const token = yield select(selectToken)
    const voting = yield select(selectVoting)
    const contracts = yield select(selectAllContracts)

    const [
      ethBalance,
      tokenBalanceRaw,
      registryAllowanceRaw,
      votingAllowanceRaw,
      votingRightsRaw,
    ] = yield all([
      call(ethjs.getBalance, owner),
      call(token.balanceOf.call, owner),
      call(token.allowance.call, owner, registry.address),
      call(token.allowance.call, owner, voting.address),
      call(voting.voteTokenBalance.call, owner),
    ])

    const ETH = toEther(ethBalance)
    const tokenBalance = baseToConvertedUnit(tokenBalanceRaw, contracts.get('tokenDecimals'))
    const registryAllowance = baseToConvertedUnit(
      registryAllowanceRaw,
      contracts.get('tokenDecimals')
    )
    const votingAllowance = baseToConvertedUnit(
      votingAllowanceRaw,
      contracts.get('tokenDecimals')
    )
    const votingRights = baseToConvertedUnit(votingRightsRaw, contracts.get('tokenDecimals'))

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
