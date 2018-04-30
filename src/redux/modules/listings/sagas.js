import { all, take, takeEvery, fork, call, put, select } from 'redux-saga/effects'

import * as logsTypes from '../logs/types'
import { selectAllListings } from './selectors'

import * as actions from './actions'
import {
  updateListings,
  createListing,
  updateAssortedListings,
  findListing,
} from './utils'

import { baseToConvertedUnit } from '../../libs/units'
import { selectTCR } from '../home/selectors'

export default function* rootListingsSaga() {
  yield takeEvery(logsTypes.POLL_LOGS_SUCCEEDED, handleNewPollLogsSaga)
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

// TODO: check for involved listings (Activities)
// TODO: discard stale listings
export function* handleNewPollLogsSaga(action) {
  try {
    const allListings = yield select(selectAllListings)
    const tcr = yield select(selectTCR)
    const logs = action.payload

    const candidates = logs.filter(log => log.eventName === '_Application')
    const assorted = logs.filter(log => log.eventName !== '_Application')

    // create listings
    if (candidates.length) {
      // console.log(candidates.length, '_Application logs:', candidates)

      const listings = yield all(
        candidates.map(candidate =>
          createListing(candidate.logData, candidate.txData, candidate.msgSender)
        )
      )
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
    if (assorted.length) {
      // console.log(assorted.length, 'assorted logs:', assorted)

      assorted.forEach(event => {
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

      const updatedListings = yield call(updateAssortedListings, assorted, allListings)
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
