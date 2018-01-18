import { all, takeLatest, fork, takeEvery, call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import { newArray, logsError, updateItems, pollLogsRequest } from '../actions'

import { getRegistry } from '../services'

import { SET_CONTRACTS, POLL_LOGS_REQUEST, SET_WALLET } from '../actions/constants'

import { logUtils, commonUtils } from './utils'
import { tokensAllowedSaga } from './token'

import { getEthjs } from '../libs/provider'

let lastReadBlockNumber = 10

export default function* logsSaga() {
  // yield takeLatest(SET_WALLET, getFreshLogs)
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
    // const allEvents = yield call(handleLogs, lastReadBlockNumber, 'latest')
    const applications = yield call(handleLogs, lastReadBlockNumber, 'latest', '_Application')

    // console.log('allEvents', allEvents)
    console.log('applications', applications)

    // yield put(newArray(allEvents))
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

    const filter = yield call(
      logUtils.buildFilter,
      registry.address,
      topic,
      sb,
      eb
    )
    const rawLogs = yield call(eth.getLogs, filter)

    // console.log('rawLogs', rawLogs)
    if (rawLogs.length === 0) return []

    const decodedLogs = yield call(
      logUtils.decodeLogs,
      eth,
      registry.contract,
      rawLogs
    )
    // console.log('decodedLogs', decodedLogs)

    return yield all(
      yield decodedLogs.map(async (dLog, ind) => {
        // TODO: estimate block.timestamp without having to call eth.getBlock...
        const block = await commonUtils.getBlock(eth, rawLogs[ind].blockHash)
        const txDetails = await commonUtils.getTransaction(
          eth,
          rawLogs[ind].transactionHash
        )
        // ...then you can get rid of block input
        return buildListing(rawLogs, registry, block, dLog, ind, txDetails)
      })
    )
  } catch (err) {
    console.log('Fresh log error:', err)
    yield put(logsError('logs error', err))
  }
}

function* buildListing(rawLogs, registry, block, dLog, i, txDetails) {
  // This function does not scale

  // TODO: reduce the # of inputs & call queries

  // Note: is there any other use for rawLogs input?
  // ...as of now, it's being thrown in just for the contractAddress
  // ...might have some use in checking filter topics?

  // rawLogs = [{
  //   address: '0x0d8cc4b8d15d4c3ef1d70af0071376fb26b5669b',
  //   blockHash:
  //     '0x96bbfd0ec4393aacdd86cb00e6bb3514f2eb93aa778d98163457edfd8227363f',
  //   blockNumber: BN,
  //   data:
  //     '0x5ab66da856c2a768ecadb30f433bc19736cb335a1663fe2032fff4903381b6e00000000000000000000000000000000000000000000000000000000000000021000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000056973616163',
  //   logIndex: BN,
  //   topics: [
  //     '0x5cde15b9901ca13a7e2eb4fb919870d1bde9e8d93d9aa5e26945b42190067bdc',
  //   ],
  //   transactionHash:
  //     '0x7fbd2631c0a74c690769ebc6f46d46b75a41f87991933d970047f229eec29931',
  //   transactionIndex: BN,
  //   type: 'mined',
  // }, ...]
  try {
    let listingHash = dLog.listingHash

    // Get the listing struct from the mapping
    const listing = yield call(
      [registry.contract, 'listings', 'call'],
      listingHash
    )

    const isWhitelisted = yield call(
      [registry.contract, 'isWhitelisted', 'call'],
      listingHash
    )

    const tx = {
      hash: txDetails.hash,
      from: txDetails.from,
      to: txDetails.to,
      index: txDetails.transactionIndex,
      timestamp: new Date(block.timestamp * 1000).toUTCString(),
    }

    const details = {
      listingString: dLog.data ? dLog.data : null,
      listingHash,
      unstakedDeposit: listing[3].toString(10),
      pollID: dLog.pollID && dLog.pollID.toString(10),
      index: i,
      eventName: dLog._eventName,
      // contractAddress: rawLogs[i].address,
      isWhitelisted,
      // canBeWhitelisted,
      blockHash: txDetails.blockHash,
      blockNumber: txDetails.blockNumber.toNumber(10),
    }

    return commonUtils.shapeShift(block, tx, details)
  } catch (err) {
    console.log('Fresh log error:', err)
    yield put(logsError('logs error', err))
  }
}

// Timer
function* pollController() {
  const pollInterval = 2000
  while (true) {
    try {
      // Every 8 secs:
      yield call(delay, pollInterval)
      // Dispatch: log query request
      yield put(pollLogsRequest({ startBlock: lastReadBlockNumber, endBlock: 'latest' }))
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
    const newLogs = yield call(
      handleLogs,
      action.payload.startBlock,
      action.payload.endBlock
    )

    // TODO: standardize block.timestamp
    // const blockTimestamp = yield call(eth, )

    lastReadBlockNumber = (yield call(eth.blockNumber)).toNumber(10)
    console.log('lastReadBlockNumber', lastReadBlockNumber)
    if (newLogs.length > 0) {
      yield put(updateItems(newLogs))
      yield fork(tokensAllowedSaga, registry.address)
    }
  } catch (err) {
    console.log('Fresh log error:', err)
    yield put(logsError('logs error', err))
  }
}
