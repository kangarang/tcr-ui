import { all, take, takeEvery, fork, call, put, select } from 'redux-saga/effects'

import * as logsTypes from '../logs/types'
import { selectAllListings } from './selectors'
import { selectTCR, selectNetwork } from '../home/selectors'

import * as actions from './actions'
import { baseToConvertedUnit } from 'libs/units'
import {
  updateListings,
  createListing,
  updateAssortedListings,
  findListing,
} from './utils'
import { delay } from 'redux-saga'

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
// workaround: batch the candidates and concat results
function* batchCreateListings(candidates, listings) {
  const chunkCandidates = candidates.slice(0, 4)
  console.log('chunkCandidates:', chunkCandidates)
  console.log('listings:', listings)

  if (chunkCandidates.length > 0) {
    const chunkListings = yield all(
      chunkCandidates.map(candidate =>
        createListing(candidate.logData, candidate.txData, candidate.msgSender)
      )
    )
    if (candidates.length > 4) {
      yield call(delay, 400)
    }
    return yield call(
      batchCreateListings,
      candidates.slice(4),
      listings.concat(chunkListings)
    )
  }
  return listings
}

// TODO: check for involved listings (Activities)
// TODO: discard stale listings
export function* handleNewPollLogsSaga(action) {
  try {
    const allListings = yield select(selectAllListings)
    const tcr = yield select(selectTCR)
    const network = yield select(selectNetwork)
    const logs = action.payload

    const applicantLogs = logs.filter(log => log.eventName === '_Application')
    const assortedLogs = logs.filter(log => log.eventName !== '_Application')

    if (applicantLogs.length) {
      console.log(applicantLogs.length, '_Application logs:', applicantLogs)
      // create listings
      let listings

      if (network === 'mainnet') {
        // batch for ipfs
        listings = yield call(batchCreateListings, applicantLogs, [])
      } else {
        listings = yield all(
          applicantLogs.map(appLog =>
            createListing(appLog.logData, appLog.txData, appLog.msgSender)
          )
        )
      }

      // update listings
      const applications = yield call(updateListings, listings, allListings)
      // check equality
      if (applications.equals(allListings)) {
        console.log('listings === allListings')
      } else {
        yield put(actions.setListings(applications))
      }
    }

    // update listings
    if (assortedLogs.length) {
      console.log(assortedLogs.length, 'assortedLogs logs:', assortedLogs)
      assortedLogs.forEach(event => {
        const match = findListing(event.logData, allListings)
        if (event.logData.numTokens && match) {
          console.log(
            event.msgSender.slice(0, 10),
            ' | ',
            baseToConvertedUnit(
              event.logData.numTokens,
              tcr.get('tokenDecimals')
            ).toString(),
            match.get('listingID')
          )
        }
      })
      const updatedListings = yield call(
        updateAssortedListings,
        assortedLogs,
        allListings
      )

      // check: equality
      if (updatedListings.equals(allListings)) {
        console.log('updatedListings === allListings')
      } else {
        yield put(actions.setListings(updatedListings))
      }
    }
  } catch (error) {
    console.log('error;', error)
  }
}
