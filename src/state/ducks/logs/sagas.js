import { select, takeLatest, fork, call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import EthAbi from 'ethjs-abi'

import * as actions from './actions'
import * as types from './types'
import * as epTypes from 'state/ducks/ethProvider/types'

import { selectNetwork, selectRegistry, selectVoting } from 'state/ducks/home/selectors'
import { getEthjs } from 'state/libs/provider'
import { getBlockAndTxnFromLog } from './utils'

import _utils from './utils'

let lastReadBlockNumber = 0

const eventNames = [
  // '_Application',
  // '_Challenge',
  // '_ApplicationWhitelisted',
  // '_ApplicationRemoved',
  // '_ListingRemoved',
  // '_ListingWithdrawn',
  // '_TouchAndRemoved',
  // '_ChallengeFailed',
  // '_ChallengeSucceeded',
  // '_RewardClaimed',
]
export default function* rootLogsSaga() {
  yield takeLatest(epTypes.SET_CONTRACTS, getFreshLogs)
  yield takeLatest(types.POLL_LOGS_START, pollLogsSaga)
}

function* pollingIntervalSaga() {
  let pollInterval = 5000
  const network = yield select(selectNetwork)
  if (network === 'ganache') {
    pollInterval = 2000
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
function* getFreshLogs() {
  try {
    const registry = yield select(selectRegistry)
    const voting = yield select(selectVoting)
    const blockRange = {
      fromBlock: '0',
      toBlock: 'latest',
    }
    const registryPayload = {
      abi: registry.abi,
      contractAddress: registry.address,
      eventNames,
      blockRange,
    }
    const votingPayload = {
      abi: voting.abi,
      contractAddress: voting.address,
      eventNames: [],
      blockRange,
    }
    yield call(decodeLogsSaga, { payload: registryPayload })
    yield call(decodeLogsSaga, { payload: votingPayload })
  } catch (err) {
    console.log('Fresh log error:', err)
    throw new Error(err.message)
  }
  yield fork(pollingIntervalSaga)
}

function* pollLogsSaga(action) {
  try {
    const ethjs = yield call(getEthjs)
    // change it here so that when it polls again, it'll have a different value
    lastReadBlockNumber = (yield call(ethjs.blockNumber)).toNumber(10)

    const registry = yield select(selectRegistry)
    const voting = yield select(selectVoting)

    const blockRange = action.payload

    const registryPayload = {
      abi: registry.abi,
      contractAddress: registry.address,
      eventNames,
      blockRange,
    }

    const votingPayload = {
      abi: voting.abi,
      contractAddress: voting.address,
      eventNames: [],
      blockRange,
    }
    yield call(decodeLogsSaga, { payload: registryPayload })
    yield call(decodeLogsSaga, { payload: votingPayload })
  } catch (err) {
    console.log('Poll logs error:', err)
    yield put(actions.pollLogsFailed(err))
  }
}

function* decodeLogsSaga(action) {
  try {
    const ethjs = yield call(getEthjs)
    const { abi, contractAddress, eventNames, blockRange } = action.payload
    const indexedFilterValues = {
      // listingHash:
      //   '0xdea4eb006d5cbb57e2d81cf12458b37f37b2f0885b1ed39fbf4f087155318849',
    }
    const filter = yield call(
      _utils.getFilter,
      contractAddress,
      eventNames,
      indexedFilterValues,
      abi,
      blockRange
    )
    // encoded
    const rawLogs = yield call(ethjs.getLogs, filter)
    if (rawLogs.length === 0) {
      return []
    }
    // decoder
    const decoder = yield call(EthAbi.logDecoder, abi)
    const decodedLogs = yield call(decoder, rawLogs)
    // consolidate
    const lawgs = yield rawLogs.map(async (log, index) => {
      const { block, tx } = await getBlockAndTxnFromLog(log, ethjs)
      const txData = {
        txHash: tx.hash,
        blockHash: block.hash,
        ts: block.timestamp.toString(),
      }
      const logData = decodedLogs[index]
      return {
        logData,
        txData,
        eventName: logData._eventName,
        msgSender: tx.from,
      }
    })
    if (lawgs.length > 0) {
      yield put(actions.pollLogsSucceeded(lawgs))
    }
  } catch (error) {
    console.log('logs saga error:', error)
  }
}
