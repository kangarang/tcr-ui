import { all, takeLatest, takeEvery, fork, call, put, select } from 'redux-saga/effects'
import { fromJS } from 'immutable'
import { delay } from 'redux-saga'
import Promise from 'bluebird'

import {
  setDecodedLogs,
  newArray,
  logsError,
  updateItems,
  pollLogsRequest,
} from '../actions'

import { getContract, getRegistry } from '../contracts/index';

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
  yield takeEvery(POLL_LOGS_REQUEST, pollLogsSaga)
}

// Gets fresh logs
function* getFreshLogs() {
  const registry = yield call(getRegistry)
  try {
    const [
      applications,
      challenges,
    ] = yield all([
      call(handleLogs, '1', 'latest', '_Application'),
      call(handleLogs, '1', 'latest', '_Challenge'),
    ])
    console.log('applications', applications)
    console.log('challenges', challenges)

    yield put(newArray(applications))
    // yield put(updateItems(challenges))
  } catch (err) {
    console.log('Fresh log error:', err)
    yield put(logsError('logs error', err))
  }
  yield call(tokensAllowedSaga, registry.address)

  yield call(startPolling)
}

let sB = 15

function* startPolling() {
  const eth = yield call(getEthjs)
  while (true) {
    let blockNumber = yield call(eth.blockNumber)
    if (sB < blockNumber) {
      blockNumber = yield call(eth.blockNumber)
      yield call(delay, 1000)
      console.log('blockNumber', blockNumber.toString(10))
      yield put(pollLogsRequest({ startBlock: sB, endBlock: blockNumber }))
    } else {
      blockNumber = yield call(eth.blockNumber)
      yield call(delay, 1000)
      console.log('sB was greater')
      yield put(pollLogsRequest({ startBlock: 15, endBlock: blockNumber }))
    }
  }
}

function* pollLogsSaga(action) {
  const registry = yield call(getRegistry)
  console.log('startBlock', action.payload.startBlock)
  console.log('endBlock', action.payload.endBlock)
  try {
    const newLogs = yield call(handleLogs, action.payload.startBlock, action.payload.endBlock)
    console.log('newLogs', newLogs)

    sB += 2
    yield put(updateItems(newLogs))
    // yield call(tokensAllowedSaga, registry.address)
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

  const builtLogs = yield all(
    yield decodedLogs.map(async (dLog, ind) => {
      const block = await commonUtils.getBlock(eth, rawLogs[ind].blockHash)
      const txDetails = await commonUtils.getTransaction(eth, rawLogs[ind].transactionHash)

      return call(buildListing, rawLogs, registry, block, dLog, ind, txDetails)
    })
  )
  return builtLogs
}

function* buildListing(rawLogs, registry, block, log, i, txDetails) {
  let unstakedDeposit = '0'
  if (log.deposit) {
    unstakedDeposit = fromNaturalUnit(log.deposit).toString(10)
  }

  const isWhitelisted = yield call([registry.contract, 'isWhitelisted'], log.domain)
  const canBeWhitelisted = yield call([registry.contract, 'canBeWhitelisted'], log.domain)

  const tx = {
    hash: rawLogs[i].transactionHash,
    from: txDetails.from,
    to: txDetails.to,
    index: txDetails.transactionIndex,
  }
  const details = {
    domain: log.domain,
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