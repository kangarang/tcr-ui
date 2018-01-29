import { all, takeLatest, fork, call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import EthAbi from 'ethjs-abi'
import Eth from 'ethjs'

import { newArray, logsError, updateItems, pollLogsRequest } from '../actions'

import { getRegistry, getContract } from '../services'

import { SET_CONTRACTS, POLL_LOGS_REQUEST } from '../actions/constants'

import { updateTokenBalancesSaga } from './token'

import { getEthjs } from '../libs/provider'

import logUtils from '../utils/log_utils'
import filterUtils from '../utils/filter_utils'
import value_utils from '../utils/value_utils'

let lastReadBlockNumber = 10
// let lastReadBlockNumber = 1638476

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
      '_Application',
      registry
    )

    yield put(newArray(applications))
    yield fork(updateTokenBalancesSaga, registry.address)
  } catch (err) {
    console.log('Fresh log error:', err)
    yield put(logsError('logs error', err))
  }

  // init polling
  yield fork(pollController)
}

// Timer
function* pollController() {
  const pollInterval = 5000
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
  const voting = yield call(getContract, 'voting')
  try {
    lastReadBlockNumber = (yield call(eth.blockNumber)).toNumber(10)
    console.log('lastReadBlockNumber', lastReadBlockNumber)
    console.log('action', action)
    const newLogs = yield call(
      handleLogs,
      action.payload.startBlock,
      action.payload.endBlock,
      '',
      registry,
    )
    console.log('newLogs', newLogs)
    yield put(updateItems(newLogs))
    yield fork(updateTokenBalancesSaga, registry.address)
    yield fork(updateTokenBalancesSaga, voting.address)
  } catch (err) {
    console.log('Fresh log error:', err)
    yield put(logsError('logs error', err))
  }
}

function* handleLogs(sb, eb, topic, contract) {
  try {
    const eth = yield call(getEthjs)

    const blockRange = yield {
      fromBlock: new Eth.BN(sb),
      toBlock: eb,
    }
    const filter = yield call(
      filterUtils.getFilter,
      contract.address,
      topic,
      [],
      contract.contract.abi,
      blockRange
    )
    console.log('filter', filter)

    const rawLogs = yield call(eth.getLogs, filter)
    console.log('rawLogs', rawLogs)

    const decoder = yield call(EthAbi.logDecoder, contract.contract.abi)
    const decodedLogs = yield call(decoder, rawLogs)
    console.log('decodedLogs', decodedLogs, decodedLogs.length)

    return yield all(
      (yield decodedLogs.map(async (dLog, ind) => {
        const block = await logUtils.getBlock(eth, rawLogs[ind].blockHash)
        const txDetails = await logUtils.getTransaction(
          eth,
          rawLogs[ind].transactionHash
        )
        return buildListing(contract, block, dLog, ind, txDetails)
      })).filter(lawg => (lawg !== false))
    )
  } catch (err) {
    console.log('Fresh log error:', err)
    yield put(logsError('logs error', err))
  }
}

async function buildListing(contract, block, dLog, i, txDetails) {
  try {
    // Get the listing struct from the mapping
    if (!dLog.listingHash) {
      return false
    }
    const listing = await contract.contract.listings.call(dLog.listingHash)
    console.log('listing', listing)
    if (
      !listing ||
      listing[2] === '0x0000000000000000000000000000000000000000'
    ) {
      return false
    }

    // const isWhitelisted = listing[1]
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
      listingString: dLog.data,
      listingHash: dLog.listingHash,
      unstakedDeposit: listing[3] ? value_utils.toUnitAmount(listing[3], 18) : false,
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
