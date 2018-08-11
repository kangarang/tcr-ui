import { takeEvery, all, call, put, select } from 'redux-saga/effects'
import sortBy from 'lodash/fp/sortBy'

import { ipfsCheckMultihash } from 'libs/ipfs'
import * as logsTypes from 'modules/logs/types'
import * as logActions from 'modules/logs/actions'
import { selectAccount } from 'modules/home/selectors'

import * as actions from '../actions'
import { selectAllListings } from '../selectors'
import { updateListings, createListing, transformListings } from '../utils'

import { batchCreateListings } from './utils'

export default function* rootListingsSaga() {
  yield takeEvery(logsTypes.POLL_LOGS_SUCCEEDED, polledLogsSaga)
}

// Receives decoded logs, sorts them by block.timestamp, then delegates where to go next
export function* polledLogsSaga(action) {
  try {
    const logs = action.payload
    // Filter for application events
    const applicantLogs = logs.filter(log => log.eventName === '_Application')

    // Sort based on the block.timestamp of the tx
    if (applicantLogs.length) {
      const sortedApplicantLogs = sortBy([l => l.txData.blockTimestamp], applicantLogs)
      yield call(handleApplicationLogsSaga, sortedApplicantLogs)
    }

    // Filter for all other events
    const assortedLogs = logs.filter(log => log.eventName !== '_Application')

    // Sort base on the block.timestamp of the tx
    if (assortedLogs.length) {
      const sortedAssortedLogs = sortBy([l => l.txData.blockTimestamp], assortedLogs)
      yield call(handleAssortedLogsSaga, sortedAssortedLogs)
    }
  } catch (error) {
    yield put(logActions.pollLogsFailed(error))
  }
}

// receives _Application logs, converts them to Listings,
// then updates allListings
function* handleApplicationLogsSaga(appLogs) {
  try {
    const allListings = yield select(selectAllListings)
    // convert logs to Listings
    const listings = yield call(logsToListings, appLogs)
    // Update candidates
    const candidates = yield call(updateListings, listings, allListings)
    // check equality to current redux state
    if (candidates.equals(allListings)) {
      console.log('applicants === allListings')
    } else {
      yield put(actions.setAllListings(candidates))
    }
  } catch (error) {
    yield put(logActions.pollLogsFailed(error))
  }
}

// converts _Application logs -> Listing object
export function* logsToListings(logs) {
  // Create listings from _Application event logs
  let listings
  // Check if the logs include ipfs multihashes and therefore need to be batched
  // TODO: one check is probably not enough?
  // -- should we batch regardless then? :(
  if (ipfsCheckMultihash(logs[0].logData.data)) {
    // Batch requests to ipfs
    listings = yield call(batchCreateListings, logs, [])
  } else {
    // If we don't have to pull listing metadata from ipfs,
    // map through the logs and build listing entities for each application
    listings = yield all(logs.map(log => createListing(log.logData, log.txData)))
  }
  return listings
}

// receives !(_Application) logs, updates allListings
function* handleAssortedLogsSaga(logs) {
  try {
    const allListings = yield select(selectAllListings)
    const account = yield select(selectAccount)

    const updatedListings = yield call(transformListings, logs, allListings, account)

    // check: equality
    if (updatedListings.equals(allListings)) {
      console.log('updatedListings === allListings')
    } else {
      yield put(actions.setAllListings(updatedListings))
    }
  } catch (error) {
    yield put(logActions.pollLogsFailed(error))
  }
}
