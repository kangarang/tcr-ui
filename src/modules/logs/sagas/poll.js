import { select, all, takeEvery, takeLatest, call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import EthAbi from 'ethjs-abi'

import * as actions from '../actions'
import * as types from '../types'

import {
  selectNetwork,
  selectRegistry,
  selectVoting,
  selectToken,
  selectAccount,
} from 'modules/home/selectors'
import { getEthjs } from 'libs/provider'
import _utils, { getBlockAndTxnFromLog } from './utils'

import { notificationsSaga } from './notifications'

function* pollLogsSaga(action) {
  try {
    const registry = yield select(selectRegistry)
    const voting = yield select(selectVoting)
    const token = yield select(selectToken)
    const account = yield select(selectAccount)

    const blockRange = action.payload

    const registryPayload = {
      abi: registry.abi,
      contractAddress: registry.address,
      eventNames: [
        '_Application',
        '_Challenge',
        '_ApplicationWhitelisted',
        '_ApplicationRemoved',
        '_ListingRemoved',
        '_ChallengeFailed',
        '_ChallengeSucceeded',
        '_RewardClaimed',
        // '_TouchAndRemoved',
        // '_ListingWithdrawn',
      ],
      blockRange,
    }
    const votingPayload = {
      abi: voting.abi,
      contractAddress: voting.address,
      eventNames: ['_PollCreated', '_VoteCommitted', '_VoteRevealed'],
      blockRange,
    }
    const tokenPayload = {
      abi: token.abi,
      contractAddress: token.address,
      eventNames: ['Transfer'],
      blockRange,
      indexedFilterValues: {
        // here, we can specify values of indexed event emissions
        _to: account,
        _from: registry.address,
      },
    }
    yield put(actions.decodeLogsStart(registryPayload))
    yield put(actions.decodeLogsStart(votingPayload))
    yield put(actions.decodeLogsStart(tokenPayload))
  } catch (err) {
    yield put(actions.pollLogsFailed(err))
  }
}

export function* decodeLogsSaga(action) {
  try {
    const ethjs = yield call(getEthjs)
    const {
      abi,
      contractAddress,
      eventNames,
      blockRange,
      indexedFilterValues,
    } = action.payload

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
      yield put(actions.decodeLogsSucceeded(lawgs))
    }
    // const currentBlock = yield call(ethjs.blockNumber)

    // notifications
    // if (lawgs.length === 1 && lawgs[0].txData.blockNumber.lt(currentBlock)) {
    if (lawgs.length < 3) {
      yield all(lawgs.map(lawg => notificationsSaga(lawg)))
    }
  } catch (err) {
    yield put(actions.decodeLogsFailed(err))
  }
}

let lastReadBlockNumber = 'latest'

export function* initPolling() {
  while (true) {
    try {
      const ethjs = yield call(getEthjs)
      const network = yield select(selectNetwork)
      let pollInterval = 3000

      if (network === 'rinkeby') {
        pollInterval = 2000
      }
      // wait, then dispatch another poll request
      yield call(delay, pollInterval)

      // get the current block number
      const currentBlockNumber = yield call(ethjs.blockNumber)
      if (
        lastReadBlockNumber !== currentBlockNumber.toString() ||
        lastReadBlockNumber === 'latest'
      ) {
        console.log('currentBlockNumber.toString():', currentBlockNumber.toString())
        console.log('lastReadBlockNumber:', lastReadBlockNumber)
        // set the new last-read startBlock number
        // change it here so that when it polls again, it'll have a different value
        lastReadBlockNumber = currentBlockNumber.toString()
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

export default function* rootLogsSaga() {
  yield takeEvery(types.POLL_LOGS_START, pollLogsSaga)
  yield takeEvery(types.DECODE_LOGS_START, decodeLogsSaga)
}
