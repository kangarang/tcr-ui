import { put, call, select, all, takeLatest } from 'redux-saga/effects'

import { getEthjs } from 'libs/provider'

import * as actions from '../actions'
import * as types from '../types'

import {
  selectTCR,
  selectAccount,
  selectRegistry,
  selectToken,
  selectVoting,
} from 'modules/home/selectors'
import { fromTokenBase, fromWei } from 'libs/units'

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

    // convert/format from base units
    const decimals = tcr.get('tokenDecimals')
    const [registryAllowance, votingAllowance, votingRights, lockedTokens] = yield all([
      fromTokenBase(registryAllowanceRaw['0'], decimals),
      fromTokenBase(votingAllowanceRaw['0'], decimals),
      fromTokenBase(votingRightsRaw['0'], decimals),
      fromTokenBase(lockedTokensRaw['0'], decimals),
    ])

    const totalRegistryStakeRaw = yield call(token.balanceOf, registry.address)
    const totalVotingStakeRaw = yield call(token.balanceOf, voting.address)
    // prettier-ignore
    const totalStake = fromTokenBase(totalRegistryStakeRaw['0'].add(totalVotingStakeRaw['0']), decimals)

    // dispatch formatted
    const balances = {
      ETH: fromWei(ethBalance, 'ether'),
      token: fromTokenBase(tokenBalanceRaw['0'], decimals),
      registryAllowance,
      votingAllowance,
      votingRights,
      lockedTokens,
      totalStake,
    }
    yield put(actions.updateBalancesSucceeded({ balances }))
  } catch (error) {
    yield put(actions.updateBalancesFailed({ error }))
  }
}
