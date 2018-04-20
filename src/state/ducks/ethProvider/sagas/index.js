import utils from 'ethers/utils'
import { put, call, select, all, takeLatest } from 'redux-saga/effects'

import { getEthjs } from 'state/libs/provider'

import * as actions from '../actions'
import * as types from '../types'

import {
  selectTCR,
  selectAccount,
  selectRegistry,
  selectToken,
  selectVoting,
} from 'state/ducks/home/selectors'

export default function* balancesSaga() {
  yield takeLatest(types.UPDATE_BALANCES_START, updateBalancesSaga)
}

function* updateBalancesSaga() {
  try {
    const ethjs = yield call(getEthjs)
    const tcr = yield select(selectTCR)
    const account = yield select(selectAccount)
    const registry = yield select(selectRegistry)
    const token = yield select(selectToken)
    const voting = yield select(selectVoting)

    // get: balances, allowances, votingRights, lockedVotingRights
    const [
      ethBalance,
      tokenBalanceRaw,
      registryAllowanceRaw,
      votingAllowanceRaw,
      votingRightsRaw,
      lockedTokensRaw,
    ] = yield all([
      ethjs.getBalance(account),
      token.balanceOf(account),
      token.allowance(account, registry.address),
      token.allowance(account, voting.address),
      voting.voteTokenBalance(account),
      voting.getLockedTokens(account),
    ])

    // format: strings, commas, decimals
    const decimals = tcr.tokenDecimals
    const [
      ETH,
      tokenBalance,
      registryAllowance,
      votingAllowance,
      votingRights,
      lockedTokens,
    ] = yield all([
      utils.formatEther(ethBalance.toString(), { commify: true }),
      utils.formatUnits(tokenBalanceRaw['0'], decimals, { commify: true }),
      utils.formatUnits(registryAllowanceRaw['0'], decimals, { commify: true }),
      utils.formatUnits(votingAllowanceRaw['0'], decimals, { commify: true }),
      utils.formatUnits(votingRightsRaw['0'], decimals, { commify: true }),
      utils.formatUnits(lockedTokensRaw['0'], decimals, { commify: true }),
    ])

    // dispatch formatted
    const balances = {
      ETH,
      token: tokenBalance,
      registryAllowance,
      votingAllowance,
      votingRights,
      lockedTokens,
      totalRegistryStake: '0',
    }
    yield put(actions.updateBalancesSucceeded({ balances }))
  } catch (error) {
    yield put(actions.updateBalancesFailed({ error }))
  }
}
