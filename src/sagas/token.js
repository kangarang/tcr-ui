import utils from 'ethers/utils'
import { put, select, all, takeEvery } from 'redux-saga/effects'
import { UPDATE_BALANCES_REQUEST } from 'actions/constants'
import { updateBalances } from '../actions'
import {
  selectProvider,
  selectAccount,
  selectRegistry,
  selectToken,
  selectVoting,
  selectAllContracts,
  selectWhitelist,
} from '../selectors'
import { BN } from 'libs/units'

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
    const listings = yield select(selectWhitelist)

    const [
      ethBalance,
      tokenBalanceRaw,
      registryAllowanceRaw,
      votingAllowanceRaw,
      votingRightsRaw,
      lockedTokensRaw,
    ] = yield all([
      provider.getBalance(owner),
      token.functions.balanceOf(owner),
      token.functions.allowance(owner, registry.address),
      token.functions.allowance(owner, voting.address),
      voting.functions.voteTokenBalance(owner),
      voting.functions.getLockedTokens(owner),
    ])

    const decimals = contracts.get('tokenDecimals')

    const [
      ETH,
      tokenBalance,
      registryAllowance,
      votingAllowance,
      votingRights,
      lockedTokens,
    ] = yield all([
      utils.formatEther(ethBalance, { commify: true }),
      utils.formatUnits(tokenBalanceRaw, decimals, { commify: true }),
      utils.formatUnits(registryAllowanceRaw, decimals, { commify: true }),
      utils.formatUnits(votingAllowanceRaw, decimals, { commify: true }),
      utils.formatUnits(votingRightsRaw, decimals, { commify: true }),
      utils.formatUnits(lockedTokensRaw, decimals, { commify: true }),
    ])

    const stakeRaw = yield listings.reduce((acc, val) => {
      return acc.add(BN(val.get('unstakedDeposit')))
    }, BN('0'))
    const totalRegistryStake = utils.formatUnits(stakeRaw, decimals, { commify: true })

    const balances = {
      ETH,
      token: tokenBalance,
      registryAllowance,
      votingAllowance,
      votingRights,
      lockedTokens,
      totalRegistryStake,
    }
    yield put(updateBalances({ balances }))
  } catch (err) {
    console.log('Update balances error:', err)
  }
}
