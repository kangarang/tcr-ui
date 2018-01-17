import { all, takeLatest, fork, takeEvery, call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import {
  newArray,
  logsError,
  updateItems,
  pollLogsRequest,
} from '../actions'

import { getRegistry } from '../services';

import { SET_CONTRACTS, POLL_LOGS_REQUEST } from "../actions/constants";

import {
  logUtils,
  commonUtils,
} from './utils'
import { tokensAllowedSaga } from "./token";

import { getEthjs } from "../libs/provider";

export default function* logsSaga() {
  yield takeLatest(SET_CONTRACTS, getFreshLogs)
  yield takeEvery(POLL_LOGS_REQUEST, pollLogsSaga)
}

// Init log queries
function* getFreshLogs() {
  // TODO: initial log queries (Backend APIs - GovernX, Etherscan)

  // We need a few things:
  // 1. get current registry and contexts
  // 2. get current applications and contexts
  // 3. get current challenges (faceoffs) and contexts
  const registry = yield call(getRegistry)
  try {
    const allEvents = yield call(handleLogs, sB, 'latest')
    const applications = yield call(handleLogs, sB, 'latest', '_Application')

    console.log('allEvents', allEvents)
    console.log('applications', applications)

    yield put(newArray(applications))
  } catch (err) {
    console.log('Fresh log error:', err)
    yield put(logsError('logs error', err))
  }
  yield fork(tokensAllowedSaga, registry.address)

  // init polling
  yield call(pollController)
}

function* handleLogs(sb, eb, topic) {
  try {
    const eth = yield call(getEthjs)
    const registry = yield call(getRegistry)

    const filter = yield call(logUtils.buildFilter, registry.address, topic, sb, eb)
    const rawLogs = yield call(eth.getLogs, filter)
    console.log('rawLogs', rawLogs)

    const decodedLogs = yield call(logUtils.decodeLogs, eth, registry.contract, rawLogs)
    console.log('decodedLogs', decodedLogs)

    return yield all(
      yield decodedLogs.map(async (dLog, ind) => {
        const block = await commonUtils.getBlock(eth, rawLogs[ind].blockHash)
        const txDetails = await commonUtils.getTransaction(eth, rawLogs[ind].transactionHash)
        return buildListing(rawLogs, registry, block, dLog, ind, txDetails)
      })
    )
  } catch (err) {
    console.log('Fresh log error:', err)
    yield put(logsError('logs error', err))
  }
}

function* buildListing(rawLogs, registry, block, dLog, i, txDetails) {
  // dLog = {
  //   0, 1, 2,
  //   data: 'isaac',
  //   listingHash: '0x5ab...',
  //   _eventName: '_Application'
  // }

  // Note: this function does not scale
  // TODO: reduce the # of calls
  try {
    let unstakedDeposit = '0'
    let listingHash = dLog.listingHash

    // Get the listing struct from the mapping
    const listing = yield call([registry.contract, 'listings', 'call'], listingHash)
    unstakedDeposit = listing[3].toString(10)

    console.log('listing', listing)

    const isWhitelisted = yield call([registry.contract, 'isWhitelisted', 'call'], listingHash)
    const canBeWhitelisted = yield call([registry.contract, 'canBeWhitelisted', 'call'], listingHash)

    const tx = {
      hash: rawLogs[i].transactionHash,
      from: txDetails.from,
      to: txDetails.to,
      index: txDetails.transactionIndex,
      timestamp: (new Date(block.timestamp * 1000)).toUTCString()
    }
    
    const details = {
      listing: dLog.data,
      unstakedDeposit,
      pollID: dLog.pollID && dLog.pollID.toString(10),
      index: i,
      eventName: dLog._eventName,
      contractAddress: rawLogs[i].address,
      isWhitelisted,
      canBeWhitelisted,
      listingHash,
    }

    return commonUtils.shapeShift(block, tx, details)
  } catch (err) {
    console.log('Fresh log error:', err)
    yield put(logsError('logs error', err))
  }
}

let sB = 10

// Timer
function* pollController() {
  const pollInterval = 2000
  while (true) {
    try {

      // Every 2 secs:
      yield call(delay, pollInterval)
      // Dispatch: log query request
      yield put(pollLogsRequest({ startBlock: sB, endBlock: 'latest' }))
      // -> pollLogsSaga(action)
      // -> handleLogs(sb, eb, '_Application')

    } catch (err) {
      console.log('Polling Log Saga error', err)
      throw new Error(err)
    }
  }
}

function* pollLogsSaga(action) {
  const eth = yield call(getEthjs)
  const registry = yield call(getRegistry)
  try {
    const newLogs = yield call(handleLogs, action.payload.startBlock, action.payload.endBlock)

    // TODO: standardize block.timestamp
    // const blockTimestamp = yield call(eth, )

    sB += 5
    yield put(updateItems(newLogs))
    yield fork(tokensAllowedSaga, registry.address)
  } catch (err) {
    console.log('Fresh log error:', err)
    yield put(logsError('logs error', err))
  }
}

