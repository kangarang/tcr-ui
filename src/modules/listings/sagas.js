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
import { saveSettings } from 'libs/localStorage'

export default function* rootListingsSaga() {
  yield takeEvery(logsTypes.DECODE_LOGS_SUCCEEDED, handleNewPollLogsSaga)
  yield fork(listenForApplications)
}

// _Application log listener
export function* listenForApplications() {
  try {
    while (true) {
      const action = yield take(logsTypes.FRESH_APPLICATIONS)
      yield call(handleNewPollLogsSaga, action)
    }
  } catch (error) {
    console.log('listenForApplications error:', error)
  }
}

// ipfs.infura rate limit: > 6 requests at a time
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

// TODO: check for involved listings (Activities)
// TODO: discard stale listings
export function* handleNewPollLogsSaga(action) {
  try {
    const logs = action.payload

    // filter for application events
    const applicantLogs = logs.filter(log => log.eventName === '_Application')

    if (applicantLogs.length) {
      const sortedApplicantLogs = sortBy([l => l.txData.blockTimestamp], applicantLogs)
      yield call(handleApplicationLogsSaga, sortedApplicantLogs)
    }

    // filter for all other types of events
    const assortedLogs = logs.filter(log => log.eventName !== '_Application')

    if (assortedLogs.length) {
      // update listings
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
    // console.log(logs.length, '_Application logs:', logs)
    const network = yield select(selectNetwork)

    // create listings
    let listings
    if (network === 'mainnet' && !appLogs[0].logData.listingID) {
      // batch for ipfs
      listings = yield call(batchCreateListings, appLogs, [])
      // console.log('listings:', listings)
    } else {
      listings = yield all(
        appLogs.map(appLog => createListing(appLog.logData, appLog.txData))
      )
    }

    // update listings
    const applications = yield call(updateListings, listings, allListings)
    // check equality to current redux state
    if (applications.equals(allListings)) {
      console.log('applications === allListings')
    } else {
      yield put(actions.setListings(applications))
      // Save settings: persist state
      // lastReadBlkNum: get from the last item in the array of various event logs
      yield call(saveSettings, {
        persistState: true,
        lastReadBlockNumber: appLogs[appLogs.length - 1].txData.blockTimestamp,
      })
    }
  } catch (error) {
    yield put(logActions.pollLogsFailed(error))
  }
}

function* handleAssortedLogsSaga(logs) {
  try {
    const allListings = yield select(selectAllListings)
    const tcr = yield select(selectTCR)
    const account = yield select(selectAccount)
    // console.log(logs.length, 'assorted logs:', logs)

    // print: address | numTokens listingID
    // 0xd09cc3bc  |  2345 yeehaw
    // logs.forEach(event => {
    //   const match = findListing(event.logData, allListings)
    //   if (event.logData.numTokens && match) {
    //     console.log(
    //       event.txOrigin.slice(0, 10),
    //       ' | ',
    //       baseToConvertedUnit(
    //         event.logData.numTokens,
    //         tcr.get('tokenDecimals')
    //       ).toString(),
    //       match.get('listingID')
    //     )
    //   }
    // })

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
