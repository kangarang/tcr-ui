import { select, takeEvery, call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import { selectRegistry, selectVoting } from 'modules/home/selectors'
import { getEthjs } from 'libs/provider'

import { decodeLogsSaga } from './decode'
import * as actions from '../actions'
import * as types from '../types'

export default function* rootLogsSaga() {
  // action carries data about what type of logs we want to poll,
  // forwards to the decoder, then eventually the listings sagas
  yield takeEvery(types.DECODE_LOGS_START, decodeLogsSaga)
  // action received from initPolling, forwards the action's blockRange value to pollLogsSaga
  yield takeEvery(types.POLL_LOGS_START, pollLogsSaga)
}

// counter
let lastReadBlockNumber = 0

export function* initPolling() {
  while (true) {
    try {
      const ethjs = yield call(getEthjs)
      // interval between polls
      let pollInterval = 3000
      // wait the interval, then continue
      yield call(delay, pollInterval)

      // get the current block number
      const currentBlockNumber = (yield call(ethjs.blockNumber)).toNumber()
      // if the blockchain has grown since we last checked,
      if (currentBlockNumber > lastReadBlockNumber) {
        // dispatch a request to poll for new logs using the
        // counter's value as the startBlock range value,
        // and set the counter to the currentBlockNumber
        lastReadBlockNumber = currentBlockNumber
        yield put(
          actions.pollLogsStart({
            startBlock: lastReadBlockNumber,
            endBlock: 'latest',
          })
        )
      }
    } catch (err) {
      yield put(actions.pollLogsFailed(err))
    }
  }
}

function* pollLogsSaga(action) {
  try {
    const registry = yield select(selectRegistry)
    const voting = yield select(selectVoting)

    // the action is a block range
    const blockRange = action.payload

    // declare what kinda logs we want to see:
    // which events, where they're coming from, when they happened
    const registryPayload = {
      blockRange,
      contract: registry,
      eventNames: [
        '_Application',
        '_Challenge',
        '_ApplicationWhitelisted',
        '_ApplicationRemoved',
        '_ListingRemoved',
        '_ChallengeFailed',
        '_ChallengeSucceeded',
        '_RewardClaimed',
        '_TouchAndRemoved',
        '_ListingWithdrawn',
      ],
    }
    // 1 for the voting contract too
    const votingPayload = {
      blockRange,
      contract: voting,
      eventNames: ['_PollCreated', '_VoteCommitted', '_VoteRevealed'],
    }

    // dispatch the proto-filters to build real filter objects
    yield put(actions.decodeLogsStart(registryPayload))
    yield put(actions.decodeLogsStart(votingPayload))
  } catch (err) {
    yield put(actions.pollLogsFailed(err))
  }
}
