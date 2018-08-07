import { select, takeLatest, take, fork, call, put } from 'redux-saga/effects'
import { removeAll } from 'react-notification-system-redux'

import { homeTypes, homeSelectors } from 'modules/home'
import * as actions from '../actions'
import * as types from '../types'
import * as liActions from 'modules/listings/actions'
import { loadState, loadSettings } from 'libs/localStorage'

import rootPollLogsSaga, { initPolling } from './poll'

export default function* rootLogsSaga() {
  yield fork(rootPollLogsSaga)
  yield takeLatest(homeTypes.SET_CONTRACTS, getFreshLogs)
}

function* getFreshLogs() {
  try {
    const network = yield select(homeSelectors.selectNetwork)
    const registry = yield select(homeSelectors.selectRegistry)
    const voting = yield select(homeSelectors.selectVoting)
    const blockRange = {
      fromBlock: network === 'mainnet' ? '5000000' : '0',
      toBlock: 'latest',
    }
    const settings = yield call(loadSettings)
    if (settings && settings.persistState && settings.lastReadBlockNumber) {
      blockRange.fromBlock = settings.lastReadBlockNumber
    } else if (settings && settings.persistState) {
      const persistedState = yield loadState()
      if (persistedState && persistedState.listings.listings) return
    }
    // yield put(liActions.setListings({}))
    yield put(removeAll())

    // applications and challenges
    const initialPayload = {
      abi: registry.abi,
      blockRange,
      contractAddress: registry.address,
      eventNames: ['_Application', '_Challenge'],
    }
    // voting logs
    const votingPayload = {
      abi: voting.abi,
      contractAddress: voting.address,
      eventNames: ['_VoteCommitted', '_VoteRevealed'],
      blockRange,
    }
    const finalPayload = {
      abi: registry.abi,
      blockRange,
      contractAddress: registry.address,
      eventNames: [
        '_ApplicationWhitelisted',
        '_ApplicationRemoved',
        '_ListingRemoved',
        '_ChallengeFailed',
        '_ChallengeSucceeded',
        '_RewardClaimed',
        // '_ListingWithdrawn',
        // '_TouchAndRemoved',
      ],
    }
    yield put(actions.decodeLogsStart(initialPayload))
    // wait for success
    yield take(types.DECODE_LOGS_SUCCEEDED)
    yield put(actions.decodeLogsStart(votingPayload))
    yield take(types.DECODE_LOGS_SUCCEEDED)
    yield put(actions.decodeLogsStart(finalPayload))
    yield take(types.DECODE_LOGS_SUCCEEDED)

    // start polling
    yield call(initPolling)
  } catch (err) {
    yield put(actions.pollLogsFailed(err))
  }
}
