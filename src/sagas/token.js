import { put, select, all, takeEvery } from 'redux-saga/effects'
import { updateBalances } from '../actions'
import { UPDATE_BALANCES_REQUEST } from '../actions/constants'
import {
  selectProvider,
  selectAccount,
  selectRegistry,
  selectToken,
  selectVoting,
  selectAllContracts,
} from '../selectors'
import { baseToConvertedUnit } from '../utils/_units'

export default function* tokenSaga() {
  yield takeEvery(UPDATE_BALANCES_REQUEST, updateBalancesSaga)
}

// TODO: tests
function* updateBalancesSaga() {
  try {
    const provider = yield select(selectProvider)
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
      provider.getBalance(owner),
      token.functions.balanceOf(owner),
      token.functions.allowance(owner, registry.address),
      token.functions.allowance(owner, voting.address),
      voting.functions.voteTokenBalance(owner),
    ])

    const ETH = baseToConvertedUnit(ethBalance, contracts.get('tokenDecimals'))

    const tokenBalance = baseToConvertedUnit(
      tokenBalanceRaw,
      contracts.get('tokenDecimals')
    )
    const registryAllowance = baseToConvertedUnit(
      registryAllowanceRaw,
      contracts.get('tokenDecimals')
    )
    const votingAllowance = baseToConvertedUnit(
      votingAllowanceRaw,
      contracts.get('tokenDecimals')
    )
    const votingRights = baseToConvertedUnit(
      votingRightsRaw,
      contracts.get('tokenDecimals')
    )
    const balances = {
      ETH,
      token: tokenBalance,
      registryAllowance,
      votingAllowance,
      votingRights,
      voterReward: '0',
    }

    yield put(
      updateBalances({
        balances,
      })
    )
  } catch (err) {
    console.log('Update balances error:', err)
  }
}
