import { all, takeLatest, fork, takeEvery, call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import EthAbi from 'ethjs-abi'
import Eth from 'ethjs'

import { newArray, logsError, updateItems, pollLogsRequest } from '../actions'

import { getRegistry } from '../services'

import { SET_CONTRACTS, POLL_LOGS_REQUEST } from '../actions/constants'

import { logUtils } from './utils'
import { tokensAllowedSaga } from './token'

import { getEthjs } from '../libs/provider'
import topics from '../libs/topics'

let lastReadBlockNumber = 1638476

export default function* logsSaga() {
  yield takeLatest(SET_CONTRACTS, getFreshLogs)
  yield takeLatest(POLL_LOGS_REQUEST, pollLogsSaga)
}

function* getFreshLogs() {
  try {
    const registry = yield call(getRegistry)
    const applications = yield call(
      handleLogs,
      lastReadBlockNumber,
      'latest',
      '_Application'
    )

    yield put(newArray(applications))
    // yield put(updateItems(applications))
    yield fork(tokensAllowedSaga, registry.address)
  } catch (err) {
    console.log('Fresh log error:', err)
    yield put(logsError('logs error', err))
  }

  // init polling
  yield fork(pollController)
}

function* handleLogs(sb, eb, topic) {
  try {
    const eth = yield call(getEthjs)
    const registry = yield call(getRegistry)

    const filter = {
      fromBlock: new Eth.BN(sb),
      toBlock: eb,
      address: registry.address,
      topics: topics[topic],
    }

    const rawLogs = yield call(eth.getLogs, filter)
    console.log('rawLogs', rawLogs)

    const decoder = yield call([EthAbi, 'logDecoder'], registry.contract.abi)
    const decodedLogs = yield call(decoder, rawLogs)
    console.log('decodedLogs', decodedLogs, decodedLogs.length)

    return yield all(
      (yield decodedLogs.map(async (dLog, ind) => {
        const block = await logUtils.getBlock(eth, rawLogs[ind].blockHash)
        const txDetails = await logUtils.getTransaction(
          eth,
          rawLogs[ind].transactionHash
        )
        return buildListing(registry, block, dLog, ind, txDetails)
      })).filter(lawg => lawg !== false)
    )
  } catch (err) {
    console.log('Fresh log error:', err)
    yield put(logsError('logs error', err))
  }
}

async function buildListing(registry, block, dLog, i, txDetails) {
  try {
    // Get the listing struct from the mapping
    if (!dLog.listingHash) {
      return false
    }
    const listing = await registry.contract.listings.call(dLog.listingHash)
    if (!listing || listing[2] === '0x0000000000000000000000000000000000000000') {
      return false
    }

    console.log('listing', listing)

    const isWhitelisted =
      dLog._eventName === '_NewListingWhitelisted' ||
      dLog._eventName === '_ChallengeFailed'

    const tx = {
      hash: txDetails.hash,
      from: txDetails.from,
      to: txDetails.to,
      index: txDetails.transactionIndex,
      timestamp: new Date(block.timestamp * 1000).toUTCString(),
    }

    const details = {
      listingString: dLog.data ? dLog.data : false,
      listingHash: dLog.listingHash,
      unstakedDeposit: listing[3] ? listing[3].toString(10) : false,
      pollID: dLog.pollID ? dLog.pollID.toString(10) : false,
      index: i,
      eventName: dLog._eventName,
      isWhitelisted,
      blockHash: txDetails.blockHash,
      blockNumber: txDetails.blockNumber && txDetails.blockNumber.toNumber(10),
    }

    return logUtils.shapeShift(block, tx, details)
  } catch (err) {
    throw new Error(err.message)
  }
}

// Timer
function* pollController() {
  const pollInterval = 15000
  while (true) {
    try {
      // Every 15 secs:
      yield call(delay, pollInterval)
      // Dispatch: log query request
      yield put(
        pollLogsRequest({
          startBlock: lastReadBlockNumber,
          endBlock: 'latest',
        })
      )
      // -> pollLogsSaga(action)
      // -> handleLogs(sb, eb, '_Application')
    } catch (err) {
      console.log('Polling Log Saga error', err)
      yield put(logsError('polling logs error', err))
    }
  }
}

function* pollLogsSaga(action) {
  const eth = yield call(getEthjs)
  const registry = yield call(getRegistry)
  try {
    lastReadBlockNumber = (yield call(eth.blockNumber)).toNumber(10)
    console.log('lastReadBlockNumber', lastReadBlockNumber)
    console.log('action', action)
    const newApplicationLogs = yield call(
      handleLogs,
      action.payload.startBlock,
      action.payload.endBlock,
      '_Application'
    )
    yield put(updateItems(newApplicationLogs))

    const newWhitelistLogs = yield call(
      handleLogs,
      action.payload.startBlock,
      action.payload.endBlock,
      '_NewDomainWhitelisted'
    )
    yield put(updateItems(newWhitelistLogs))

    const newChallengeLogs = yield call(
      handleLogs,
      action.payload.startBlock,
      action.payload.endBlock,
      '_Challenge'
    )
    yield put(updateItems(newChallengeLogs))
    yield fork(tokensAllowedSaga, registry.address)
  } catch (err) {
    console.log('Fresh log error:', err)
    yield put(logsError('logs error', err))
  }
}
