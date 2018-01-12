import { all, takeLatest, takeEvery, call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
// import Promise from 'bluebird'

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

import {
  fromNaturalUnit,
} from '../libs/units'
import { getEthjs } from "../libs/provider";

export default function* logsSaga() {
  yield takeLatest(SET_CONTRACTS, getFreshLogs)
  // yield takeEvery(POLL_LOGS_REQUEST, pollLogsSaga)
}

let sB = 15

// Gets fresh logs
function* getFreshLogs() {
  const registry = yield call(getRegistry)
  try {
    const applications = yield call(handleLogs, sB, 'latest', '_Application')
    const challenges = yield call(handleLogs, sB, 'latest', '_Challenge')
    const ne = yield call(handleLogs, sB, 'latest', '_NewListingWhitelisted')
    console.log('applications', applications)
    console.log('challenges', challenges)
    console.log('ne', ne)

    yield put(newArray(applications))
    yield put(updateItems(challenges))
    yield put(updateItems(ne))
  } catch (err) {
    console.log('Fresh log error:', err)
    yield put(logsError('logs error', err))
  }
  yield call(tokensAllowedSaga, registry.address)
  // yield call(startPolling)
}

function* startPolling() {
  yield put(pollLogsRequest({ startBlock: 1, endBlock: 'latest' }))
  yield call(pollController)
}

// Timer
function* pollController() {
  const pollInterval = 2000
  while (true) {
    try {
      yield call(delay, pollInterval)
      yield put(pollLogsRequest({ startBlock: 1, endBlock: 'latest' }))
    } catch (err) {
      console.log('Polling Log Saga error', err)
      throw new Error(err)
    }
  }
}

function* pollLogsSaga(action) {
  const registry = yield call(getRegistry)
  try {
    const newLogs = yield call(handleLogs, action.payload.startBlock, action.payload.endBlock, '_Application')
    sB += 5
    yield put(updateItems(newLogs))
    yield call(tokensAllowedSaga, registry.address)
  } catch (err) {
    console.log('Fresh log error:', err)
    yield put(logsError('logs error', err))
  }
}

function* handleLogs(sb, eb, topic) {
  const eth = yield call(getEthjs)
  const registry = yield call(getRegistry)

  const filter = yield call(logUtils.buildFilter, registry.address, topic, sb, eb)
  const rawLogs = yield call(eth.getLogs, filter)
  const decodedLogs = yield call(logUtils.decodeLogs, eth, registry.contract, rawLogs)

  // if (topic !== '_Application') {
  //   return decodedLogs
  // }

  return yield all(
    yield decodedLogs.map(async (dLog, ind) => {
      const block = await commonUtils.getBlock(eth, rawLogs[ind].blockHash)
      const txDetails = await commonUtils.getTransaction(eth, rawLogs[ind].transactionHash)
      const ddd = await buildListing(rawLogs, registry, block, dLog, ind, txDetails)
      return ddd
    })
  )
}

function* buildListing(rawLogs, registry, block, log, i, txDetails) {
  let unstakedDeposit = '0'
  const listingHash = commonUtils.getListingHash(log.listing)
  // if (log.deposit) {
  //   unstakedDeposit = fromNaturalUnit(log.deposit).toString(10)
  // } else {
  const listing = yield call([registry.contract, 'listings', 'call'], listingHash)
  unstakedDeposit = listing[3].toString(10)
  // }

  const isWhitelisted = yield call([registry.contract, 'isWhitelisted'], listingHash)
  const canBeWhitelisted = yield call([registry.contract, 'canBeWhitelisted'], listingHash)

  const tx = {
    hash: rawLogs[i].transactionHash,
    from: txDetails.from,
    to: txDetails.to,
    index: txDetails.transactionIndex,
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
  }

  return commonUtils.shapeShift(block, tx, details)
}