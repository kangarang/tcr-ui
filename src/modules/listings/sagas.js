import { all, take, takeEvery, fork, call, put, select } from 'redux-saga/effects'

import * as logsTypes from '../logs/types'
import { selectAllListings } from './selectors'

import * as actions from './actions'
import { updateListings, createListing, updateAssortedListings } from './utils'
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
    const logs = action.payload

    const candidates = logs.filter(log => log.eventName === '_Application')
    const assorted = logs.filter(log => log.eventName !== '_Application')

    if (candidates.length) {
      console.log(candidates.length, '_Application logs:', candidates)
      // create listings
      const listings = yield call(batchCreateListings, candidates, [])
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
      console.log(assorted.length, 'assorted logs:', assorted)
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
