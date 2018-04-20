import { select, takeLatest, fork, call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import EthAbi from 'ethjs-abi'

import ethProviderTypes from 'state/ducks/ethProvider/types'
import { selectNetwork, selectRegistry } from 'state/ducks/home/selectors'

import { getEthjs } from 'state/libs/provider'
// import { getBlockAndTxnFromLog } from './utils'

import actions from './actions'
import types from './types'

import _abi from './_abi'

export default function* logsSaga() {
  yield takeLatest(ethProviderTypes.SET_CONTRACTS, getFreshLogs)
  yield takeLatest(types.POLL_LOGS_START, pollLogsSaga)
}

let lastReadBlockNumber

function* getFreshLogs() {
  try {
    const registry = yield select(selectRegistry)
    const methodName = '_Application'
    const blockRange = yield {
      fromBlock: '0',
      toBlock: 'latest',
    }
    const payload = {
      abi: registry.abi,
      contractAddress: registry.address,
      methodName,
      blockRange,
    }
    yield call(decodeLogsSaga, { payload })
  } catch (err) {
    console.log('Fresh log error:', err)
    throw new Error(err.message)
  }
  yield fork(pollingIntervalSaga)
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

function* pollLogsSaga(action) {
  try {
    const ethjs = yield call(getEthjs)
    // change it here so that when it polls again, it'll have a different value
    lastReadBlockNumber = (yield call(ethjs.blockNumber)).toNumber(10)

    const registry = yield select(selectRegistry)
    const methodName = '_Application'
    const blockRange = action.payload

    const payload = {
      abi: registry.abi,
      contractAddress: registry.address,
      methodName,
      blockRange,
    }
    yield call(decodeLogsSaga, { payload })
  } catch (err) {
    console.log('Poll logs error:', err)
  }
}

function* decodeLogsSaga(action) {
  const ethjs = yield call(getEthjs)
  const { abi, contractAddress, methodName, blockRange } = action.payload
  const indexedFilterValues = {
    // listingHash:
    //   '0xdea4eb006d5cbb57e2d81cf12458b37f37b2f0885b1ed39fbf4f087155318849',
  }
  const filter = yield call(
    _abi.getFilter,
    contractAddress,
    methodName,
    indexedFilterValues,
    abi,
    blockRange
  )
  const rawLogs = yield call(ethjs.getLogs, filter)
  if (rawLogs.length === 0) {
    return []
  }
  const decoder = yield call(EthAbi.logDecoder, abi)
  const decodedLogs = yield call(decoder, rawLogs)
  console.log('decodedLogs:', decodedLogs)
  // const listings = yield decodedLogs.map(async dLog => {
  //   const blockTxn = await getBlockAndTxnFromLog(dLog, )
  //   const listing = await createListing(dLog, blockTxn, tx.from)
  // })
}
