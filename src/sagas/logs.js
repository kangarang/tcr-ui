import { select, takeLatest, fork, call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import EthAbi from 'ethjs-abi'
import Eth from 'ethjs'

import { SET_CONTRACTS, POLL_LOGS_REQUEST } from 'actions/constants'

import _abi from 'utils/_abi'

import { setListings, pollLogsRequest, updateBalancesRequest } from '../actions'

import {
  selectEthjs,
  selectNetwork,
  selectRegistry,
  selectVoting,
  selectAllListings,
} from '../selectors'

import { buildListings, updateListings } from './listings'

export default function* logsSaga() {
  yield takeLatest(SET_CONTRACTS, getFreshLogs)
  yield takeLatest(POLL_LOGS_REQUEST, pollLogsAndUpdateListingsSaga)
}

let lastReadBlockNumber = 0
function* getFreshLogs() {
  try {
    const registry = yield select(selectRegistry)
    const listings = yield call(
      logsToListingsSaga,
      lastReadBlockNumber,
      'latest',
      '',
      registry
    )

    const newListings = yield call(updateListings, [], listings)

    if (newListings.size > 0) {
      yield put(setListings(newListings))
      yield put(updateBalancesRequest())
    }
  } catch (err) {
    console.log('Fresh log error:', err)
    throw new Error(err.message)
    // yield put(logsError('logs error', err))
  }

  yield fork(pollingIntervalSaga)
}
function* pollingIntervalSaga() {
  let pollInterval = 5000 // 5 seconds
  const network = yield select(selectNetwork)
  if (network === '420') {
    pollInterval = 2000
  }
  while (true) {
    try {
      yield call(delay, pollInterval)
      yield put(
        pollLogsRequest({
          startBlock: lastReadBlockNumber,
          endBlock: 'latest',
        })
      )
    } catch (err) {
      console.log('Polling Log Saga error', err)
      // yield put(logsError('polling logs error', err))
    }
  }
}
// TODO: reduce duplicate code in getFreshLogs
// TODO: add comments
function* pollLogsAndUpdateListingsSaga(action) {
  try {
    const ethjs = yield select(selectEthjs)
    const registry = yield select(selectRegistry)
    const allListings = yield select(selectAllListings)

    lastReadBlockNumber = (yield call(ethjs.blockNumber)).toNumber(10)

    // decodes logs & builds the context of each listing
    const newListings = yield call(
      logsToListingsSaga,
      action.payload.startBlock,
      action.payload.endBock,
      '',
      registry
    )

    if (newListings.length === 0) {
      console.log('no updates...')
      return
    }
    console.log('newListings:', newListings)

    // replaces the state with updated listings
    const latestListings = yield call(updateListings, allListings, newListings)
    console.log('latestListings:', latestListings)

    yield put(setListings(latestListings))
    yield put(updateBalancesRequest())
  } catch (err) {
    console.log('Poll logs error:', err)
    // yield put(logsError('logs error', err))
  }
}

// TODO: tests
// TODO: comments
function* logsToListingsSaga(sb, eb, topic, contract) {
  try {
    const ethjs = yield select(selectEthjs)
    const voting = yield select(selectVoting)
    const blockRange = yield {
      fromBlock: new Eth.BN(sb),
      toBlock: eb,
    }
    const indexedFilterValues = {
      // listingHash:
      //   '0xdea4eb006d5cbb57e2d81cf12458b37f37b2f0885b1ed39fbf4f087155318849',
    }
    const filter = yield call(
      _abi.getFilter,
      contract.address,
      topic,
      indexedFilterValues,
      contract.abi,
      blockRange
    )

    const rawLogs = yield call(ethjs.getLogs, filter)
    if (rawLogs.length === 0) {
      return []
    }
    const decoder = yield call(EthAbi.logDecoder, contract.abi)
    const decodedLogs = yield call(decoder, rawLogs)
    console.log('decodedLogs:', decodedLogs)

    const listings = (yield call(
      buildListings,
      decodedLogs,
      ethjs,
      rawLogs,
      contract,
      voting
    )).filter(lawg => !(lawg === false))
    console.log('listings:', listings)

    return listings
  } catch (err) {
    console.log('Handle logs error:', err)
    // yield put(logsError('logs error', err))
  }
}
