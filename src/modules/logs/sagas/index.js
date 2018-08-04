import { select, takeLatest, take, fork, put } from 'redux-saga/effects'

import { homeTypes, homeSelectors } from 'modules/home'
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
    const applicationsPayload = {
      abi: registry.abi,
      blockRange,
      contractAddress: registry.address,
      eventNames: ['_Application'],
    }
    const challengePayload = {
      abi: registry.abi,
      blockRange,
      contractAddress: registry.address,
      eventNames: ['_Challenge'],
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
        '_ListingWithdrawn',
        '_TouchAndRemoved',
      ],
    }
    yield put(actions.decodeLogsStart(applicationsPayload))
    // wait for success
    yield take(types.DECODE_LOGS_SUCCEEDED)

    yield put(actions.decodeLogsStart(challengePayload))
    yield take(types.DECODE_LOGS_SUCCEEDED)
    yield put(actions.decodeLogsStart(votingPayload))
    yield take(types.DECODE_LOGS_SUCCEEDED)
    yield put(actions.decodeLogsStart(finalPayload))

    // start polling
    yield fork(initPolling)
  } catch (err) {
    yield put(actions.pollLogsFailed(err))
  }
}
