import { select, takeLatest, take, fork, call, put } from 'redux-saga/effects'
import { removeAll } from 'react-notification-system-redux'

import { homeTypes, homeSelectors } from 'modules/home'
import { loadState, loadSettings } from 'libs/localStorage'

import * as actions from '../actions'
import * as types from '../types'
import rootPollLogsSaga, { initPolling } from './poll'

export default function* rootLogsSaga() {
  yield fork(rootPollLogsSaga)
  yield takeLatest(homeTypes.SET_ALL_CONTRACTS, getFreshLogs)
}

function* getFreshLogs() {
  try {
    // remove all notifications if there are any
    yield put(removeAll())

    const network = yield select(homeSelectors.selectNetwork)
    const registry = yield select(homeSelectors.selectRegistry)
    const voting = yield select(homeSelectors.selectVoting)
    const blockRange = {
      fromBlock: network === 'mainnet' ? 5000000 : 0,
      toBlock: 'latest',
    }
    const settings = yield call(loadSettings)
    if (settings && settings.persistState && settings.lastReadBlockNumber) {
      blockRange.fromBlock = settings.lastReadBlockNumber
    } else if (settings && settings.persistState) {
      const persistedState = yield loadState()
      if (persistedState && persistedState.listings.listings) return
    }

    // applications and challenges
    const initialPayload = {
      blockRange,
      contract: registry,
      eventNames: ['_Application', '_Challenge'],
    }
    // voting logs
    const votingPayload = {
      blockRange,
      contract: voting,
      eventNames: ['_VoteCommitted', '_VoteRevealed'],
    }
    // finality logs
    const finalPayload = {
      blockRange,
      contract: registry,
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
    // wait for success each time
    yield put(actions.decodeLogsStart(initialPayload))
    yield take(types.DECODE_LOGS_SUCCEEDED)

    yield put(actions.decodeLogsStart(votingPayload))
    yield take(types.DECODE_LOGS_SUCCEEDED)

    yield put(actions.decodeLogsStart(finalPayload))
    yield take(types.DECODE_LOGS_SUCCEEDED)

    // start polling for more
    yield call(initPolling)
  } catch (err) {
    yield put(actions.pollLogsFailed(err))
  }
}
