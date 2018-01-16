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
    const applications = yield call(handleLogs, sB, 'latest', '_Application')
    const challenges = yield call(handleLogs, sB, 'latest', '_Challenge')
    const registeredListings = yield call(handleLogs, sB, 'latest', '_NewListingWhitelisted')

    console.log('applications', applications)
    console.log('challenges', challenges)
    console.log('registeredListings', registeredListings)

    yield put(newArray(applications))
    yield put(updateItems(challenges))
    yield put(updateItems(registeredListings))
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

function* buildListing(rawLogs, registry, block, log, i, txDetails) {
  // Note: this function does not scale
  // TODO: reduce the # of calls
  try {
    let unstakedDeposit = '0'
    let listingHash = log.listing

    if (log._eventName === '_Application') {
      listingHash = commonUtils.getListingHash(log.listing)
    }

    // if (log.deposit) {
    //   unstakedDeposit = fromNaturalUnit(log.deposit).toString(10)
    // } else {
    const listing = yield call([registry.contract, 'listings', 'call'], listingHash)
    unstakedDeposit = listing[3].toString(10)
    console.log('listing', listing)
    // }

    const isWhitelisted = yield call([registry.contract, 'isWhitelisted', 'call'], listingHash)
    const canBeWhitelisted = yield call([registry.contract, 'canBeWhitelisted', 'call'], listingHash)
    const status = yield call([registry.contract, 'getStatus'], listingHash)
    console.log('status', status)

    const tx = {
      hash: rawLogs[i].transactionHash,
      from: txDetails.from,
      to: txDetails.to,
      index: txDetails.transactionIndex,
      timestamp: (new Date(block.timestamp * 1000)).toUTCString()
    }
    const details = {
      listing: log.listing,
      unstakedDeposit,
      pollID: log.pollID && log.pollID.toString(10),
      index: i,
      eventName: log._eventName,
      contractAddress: rawLogs[i].address,
      isWhitelisted,
      canBeWhitelisted,
      status,
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
    const newLogs = yield call(handleLogs, action.payload.startBlock, action.payload.endBlock, '_Application')

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

