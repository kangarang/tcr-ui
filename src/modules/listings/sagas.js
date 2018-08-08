import { all, take, takeEvery, fork, call, put, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import sortBy from 'lodash/fp/sortBy'

import * as logsTypes from '../logs/types'
import { selectAllListings } from './selectors'
import { selectTCR, selectNetwork, selectAccount } from '../home/selectors'
import * as actions from './actions'
import {
  updateListings,
  createListing,
  updateAssortedListings,
  // findListing,
} from './utils'

import * as logActions from 'modules/logs/actions'
import { baseToConvertedUnit } from 'libs/units'
import { ipfsCheckMultihash } from 'libs/ipfs'
import { saveSettings } from 'libs/localStorage'

export default function* rootListingsSaga() {
  yield takeEvery(logsTypes.DECODE_LOGS_SUCCEEDED, handleNewPollLogsSaga)
}

// ipfs.infura rate limit: > 4 requests at a time
// workaround: batch the applications and concat results
function* batchCreateListings(applications, listings) {
  try {
    const chunkApplications = applications.slice(0, 4)

    if (chunkApplications.length > 0) {
      const chunkListings = yield all(
        chunkApplications.map(application =>
          createListing(application.logData, application.txData)
        )
      )
      if (applications.length > 4) {
        yield call(delay, 400)
      }

      console.log('batching..')
      return yield call(
        batchCreateListings,
        applications.slice(4),
        listings.concat(chunkListings)
      )
    }
    return listings
  } catch (error) {
    console.log('batch create listings error:', error)
  }
}

// Receives decoded logs, sorts them by block.timestamp, then delegates where to go next
export function* handleNewPollLogsSaga(action) {
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

function* handleApplicationLogsSaga(appLogs) {
  try {
    const allListings = yield select(selectAllListings)
    const network = yield select(selectNetwork)

    // Create listings from _Application event logs
    let listings
    // Check if the logs include ipfs multihashes and therefore need to be batched
    // TODO: one check is probably not enough?
    // -- should we batch regardless then? :(
    if (ipfsCheckMultihash(appLogs[0].logData.data)) {
      // Batch requests to ipfs
      listings = yield call(batchCreateListings, appLogs, [])
    } else {
      // If we don't have to pull listing metadata from ipfs,
      // map through the logs and build listing entities for each application
      listings = yield all(
        appLogs.map(appLog => createListing(appLog.logData, appLog.txData))
      )
    }

    // Update listings
    const applications = yield call(updateListings, listings, allListings)
    // check equality to current redux state
    if (applications.equals(allListings)) {
      console.log('applications === allListings')
    } else {
      yield put(actions.setListings(applications))
      // Save settings: persist state
      // lastReadBlkNum: get from the last item in the array of various event logs
      // yield call(saveSettings, {
      //   persistState: true,
      //   lastReadBlockNumber: appLogs[appLogs.length - 1].txData.blockTimestamp,
      // })
    }
  } catch (error) {
    yield put(logActions.pollLogsFailed(error))
  }
}

function* handleAssortedLogsSaga(logs) {
  try {
    const allListings = yield select(selectAllListings)
    const account = yield select(selectAccount)

    const updatedListings = yield call(updateAssortedListings, logs, allListings, account)

    // check: equality
    if (updatedListings.equals(allListings)) {
      console.log('updatedListings === allListings')
    } else {
      yield put(actions.setListings(updatedListings))
    }
  } catch (error) {
    yield put(logActions.pollLogsFailed(error))
  }
}
