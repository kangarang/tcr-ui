import { select, all, takeLatest, call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import EthAbi from 'ethjs-abi'

import * as actions from '../actions'
import * as types from '../types'

import { selectNetwork, selectRegistry, selectVoting } from 'redux/modules/home/selectors'
import { getEthjs } from 'redux/libs/provider'
import _utils, { getBlockAndTxnFromLog } from './utils'

import { notificationsSaga } from './notifications'

let lastReadBlockNumber = 0

function* pollLogsSaga(action) {
  try {
    const ethjs = yield call(getEthjs)
    // change it here so that when it polls again, it'll have a different value
    lastReadBlockNumber = (yield call(ethjs.blockNumber)).toNumber(10)

    const registry = yield select(selectRegistry)
    const voting = yield select(selectVoting)

    const blockRange = action.payload

    const rEvents = [
      '_Application',
      '_ApplicationWhitelisted',
      '_ApplicationRemoved',
      '_ListingRemoved',
      '_ListingWithdrawn',
      '_Challenge',
      '_ChallengeFailed',
      '_ChallengeSucceeded',
      '_TouchAndRemoved',
      '_RewardClaimed',
    ]

    const registryPayload = {
      abi: registry.abi,
      contractAddress: registry.address,
      eventNames: rEvents,
      blockRange,
    }

    const vEvents = ['_PollCreated', '_VoteCommitted', '_VoteRevealed']
    const votingPayload = {
      abi: voting.abi,
      contractAddress: voting.address,
      eventNames: vEvents,
      blockRange,
    }
    yield call(decodeLogsSaga, { payload: registryPayload })
    yield call(decodeLogsSaga, { payload: votingPayload })
  } catch (err) {
    console.log('Poll logs error:', err)
    yield put(actions.pollLogsFailed(err))
  }
}

export function* decodeLogsSaga(action) {
  try {
    const ethjs = yield call(getEthjs)
    const { abi, contractAddress, eventNames, blockRange } = action.payload

    // here, we can specify values of indexed event emissions
    const indexedFilterValues = {
      // listingHash: '0xdea4eb00...',
    }

    // get filter
    const filter = yield call(
      _utils.getFilter,
      contractAddress,
      eventNames,
      indexedFilterValues,
      abi,
      blockRange
    )

    // get raw encoded logs
    const rawLogs = yield call(ethjs.getLogs, filter)
    if (rawLogs.length === 0) return []

    // decode logs
    const decoder = yield call(EthAbi.logDecoder, abi)
    const decodedLogs = yield call(decoder, rawLogs)

    // consolidate: logData, txData, eventName, msgSender
    const lawgs = yield all(
      rawLogs.map(async (log, index) => {
        const { block, tx } = await getBlockAndTxnFromLog(log, ethjs)
        const txData = {
          txHash: tx.hash,
          blockHash: block.hash,
          blockNumber: block.number,
          ts: block.timestamp,
          txIndex: tx.transactionIndex.toString(),
          logIndex: rawLogs[index].logIndex.toString(),
        }
        const logData = decodedLogs[index]
        return {
          logData,
          txData,
          eventName: logData._eventName,
          msgSender: tx.from,
        }
      })
    )

    if (lawgs.length > 0) {
      // variety
      console.log(decodedLogs.length, eventNames, 'logs:', decodedLogs)
      yield put(actions.pollLogsSucceeded(lawgs))
    }
    // notifications
    if (lawgs.length < 4) {
      yield all(lawgs.map(lawg => notificationsSaga(lawg)))
    }
  } catch (error) {
    console.log('logs saga error:', error)
  }
}

export function* initPolling() {
  const network = yield select(selectNetwork)
  let pollInterval = 5000

  if (network === 'rinkeby') {
    pollInterval = 3000
  }

  while (true) {
    try {
      // wait, then dispatch another poll request
      yield call(delay, pollInterval)
      yield put(
        actions.pollLogsStart({
          startBlock: lastReadBlockNumber,
          endBlock: 'latest',
        })
      )
    } catch (err) {
      console.log('Polling Log Saga error', err)
    }
  }
}

export default function* rootLogsSaga() {
  yield takeLatest(types.POLL_LOGS_START, pollLogsSaga)
}
