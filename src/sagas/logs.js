import { all, select, takeLatest, fork, call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import EthAbi from 'ethjs-abi'
import Eth from 'ethjs'

import { newArray, logsError, updateItems, pollLogsRequest } from '../actions'

import { SET_CONTRACTS, POLL_LOGS_REQUEST } from '../actions/constants'

import { updateTokenBalancesSaga } from './token'

import logUtils from '../utils/log_utils'
import filterUtils from '../utils/filter_utils'
import value_utils from '../utils/value_utils'
import { selectEthjs, selectNetwork, selectRegistry, selectVoting } from '../selectors/index'

export default function* logsSaga() {
  yield takeLatest(SET_CONTRACTS, getFreshLogs)
  yield takeLatest(POLL_LOGS_REQUEST, pollLogsSaga)
}

let lastReadBlockNumber = 10
// let lastReadBlockNumber = 1638476

function* getFreshLogs() {
  try {
    const registry = yield select(selectRegistry)
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
    throw new Error(err.message)
    // yield put(logsError('logs error', err))
  }

  // init polling
  yield fork(pollController)
}

// Timer
function* pollController() {
  const network = yield select(selectNetwork)
  let pollInterval = 15000

  if (network === '420') {
    pollInterval = 2000 // 2 seconds for localhost:8545
  }

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
      // yield put(logsError('polling logs error', err))
    }
  }
}

// call this every 15 seconds
function* pollLogsSaga(action) {
  const ethjs = yield select(selectEthjs)
  const registry = yield select(selectRegistry)
  const voting = yield select(selectVoting)
  try {
    lastReadBlockNumber = (yield call(ethjs.blockNumber)).toNumber(10)
    const newLogs = yield call(
      handleLogs,
      action.payload.startBlock,
      action.payload.endBlock,
      '',
      registry
    )
    if (newLogs.length) {
      console.log(newLogs.length, 'newLogs', newLogs)
      yield put(updateItems(newLogs))
      yield fork(updateTokenBalancesSaga, registry.address)
      yield fork(updateTokenBalancesSaga, voting.address)
    }
  } catch (err) {
    console.log('Fresh log error:', err)
    // yield put(logsError('logs error', err))
  }
}

// async
function* handleLogs(sb, eb, topic, contract) {
  try {
    const ethjs = yield select(selectEthjs)

    const blockRange = {
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

    const rawLogs = yield call(ethjs.getLogs, filter)
    const decoder = yield call(EthAbi.logDecoder, contract.contract.abi)
    const decodedLogs = yield call(decoder, rawLogs)
    if (decodedLogs.length) {
      console.log('decodedLogs', decodedLogs)
    }

    return yield all(
      (yield decodedLogs.map(async (dLog, ind) => {
        const block = await logUtils.getBlock(ethjs, rawLogs[ind].blockHash)
        const txDetails = await logUtils.getTransaction(
          ethjs,
          rawLogs[ind].transactionHash
        )
        return buildListing(contract, block, dLog, ind, txDetails)
      })).filter(lawg => lawg !== false)
    )
  } catch (err) {
    console.log('Fresh log error:', err)
    yield put(logsError('logs error', err))
  }
}

// compile
async function buildListing(contract, block, dLog, i, txDetails) {
  try {
    // Get the listing struct from the mapping
    if (!dLog.listingHash) {
      return false
    }
    const listing = await contract.contract.listings.call(dLog.listingHash)
    if (!listing || listing[2] === '0x0000000000000000000000000000000000000000') {
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
