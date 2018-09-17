import { fork, select, takeEvery, call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import { selectRegistry, selectVoting } from 'modules/home/selectors'
import { getEthjs } from 'libs/provider'

import { getSortedLogsSaga } from './utils'
import rootDecodeLogsSaga from './decode'
import * as actions from '../actions'
import * as types from '../types'

export default function* rootLogsSaga() {
  yield fork(rootDecodeLogsSaga)
  // forward the action's blockRange value to pollLogsSaga
  yield takeEvery(types.POLL_LOGS_START, pollLogsSaga)
}

// counter
let lastReadBlockNumber = 0

// prettier-ignore
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

      // make sure lastRead is a valid starting position
      if (currentBlockNumber < lastReadBlockNumber || lastReadBlockNumber < 0) {
        throw new Error('Invalid fromBlock. It must be less than the currentBlockNumber || it cannot be negative')
      }

      // if the blockchain has grown since we last checked,
      // dispatch a request to poll for new logs using the
      // counter's value as the startBlock range value
      if (currentBlockNumber > lastReadBlockNumber) {
        yield put(actions.pollLogsStart({
          fromBlock: lastReadBlockNumber + 1,
          toBlock: currentBlockNumber,
        }))
        // set the counter to the currentBlockNumber
        lastReadBlockNumber = currentBlockNumber
      }
    } catch (err) {
      yield put(actions.pollLogsFailed(err))
    }
  }
}

// forwarded from initPolling action
function* pollLogsSaga(action) {
  try {
    const registry = yield select(selectRegistry)
    const voting = yield select(selectVoting)

    const blockRange = action.payload
    const registryEventNames = []
    const votingEventNames = []

    const sortedRegistryLogs = yield call(
      getSortedLogsSaga,
      blockRange,
      registryEventNames,
      registry
    )
    const sortedVotingLogs = yield call(getSortedLogsSaga, blockRange, votingEventNames, voting)

    yield put(actions.pollLogsSucceeded(sortedRegistryLogs))
    yield put(actions.pollLogsSucceeded(sortedVotingLogs))
  } catch (err) {
    yield put(actions.pollLogsFailed(err))
  }
}
