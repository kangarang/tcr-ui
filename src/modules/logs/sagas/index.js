import { select, takeLatest, take, fork, put } from 'redux-saga/effects'

import { homeTypes, homeSelectors } from 'modules/home'
import { liTypes } from 'modules/listings'
import * as actions from '../actions'
import * as types from '../types'

import rootPollLogsSaga, { initPolling } from './poll'

export default function* rootLogsSaga() {
  yield fork(rootPollLogsSaga)
  yield takeLatest(homeTypes.SET_CONTRACTS, getFreshLogs)
}

function* getFreshLogs() {
  try {
    const registry = yield select(homeSelectors.selectRegistry)
    const voting = yield select(homeSelectors.selectVoting)
    const blockRange = {
      fromBlock: '0',
      toBlock: 'latest',
    }

    // application logs
    const payload = {
      abi: registry.abi,
      contractAddress: registry.address,
      eventNames: ['_Application'],
      blockRange,
    }
    yield put(actions.decodeLogsStart(payload))

    // wait for success
    yield take(liTypes.SET_LISTINGS)

    // registry logs
    const fullPayload = {
      ...payload,
      eventNames: [
        '_ApplicationWhitelisted',
        '_ApplicationRemoved',
        '_ListingRemoved',
        '_ListingWithdrawn',
        '_Challenge',
        '_ChallengeFailed',
        '_ChallengeSucceeded',
        '_TouchAndRemoved',
        '_RewardClaimed',
      ],
    }
    yield put(actions.decodeLogsStart(fullPayload))

    yield take(types.DECODE_LOGS_SUCCEEDED)

    // voting logs
    const votingPayload = {
      abi: voting.abi,
      contractAddress: voting.address,
      eventNames: ['_VoteCommitted', '_VoteRevealed'],
      blockRange,
    }
    yield put(actions.decodeLogsStart(votingPayload))

    yield take(types.DECODE_LOGS_SUCCEEDED)

    // start polling
    yield fork(initPolling)
  } catch (err) {
    yield put(actions.pollLogsFailed(err))
  }
}
