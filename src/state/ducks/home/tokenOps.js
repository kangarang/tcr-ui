import utils from 'ethers/utils'
import { put, select, all, takeEvery } from 'redux-saga/effects'

import { updateBalances, UPDATE_BALANCES_REQUEST } from 'state/home/actions'

import {
  selectProvider,
  selectAccount,
  selectRegistry,
  selectToken,
  selectVoting,
  selectTCR,
} from 'state/home/selectors'

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
    const tcr = yield select(selectTCR)

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

    const decimals = tcr.tokenDecimals

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

    const balances = {
      ETH,
      token: tokenBalance,
      registryAllowance,
      votingAllowance,
      votingRights,
      lockedTokens,
      totalRegistryStake: '0',
    }
    yield put(updateBalances({ balances }))
  } catch (err) {
    console.log('Update balances error:', err)
  }
}
