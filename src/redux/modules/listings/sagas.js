import { all, take, takeEvery, fork, call, put, select } from 'redux-saga/effects'

import * as logsTypes from '../logs/types'
import { selectAllListings } from '../home/selectors'

import * as actions from './actions'
import { updateListings, createListing, updateAssortedListings } from './utils'

export default function* rootListingsSaga() {
  yield takeEvery(logsTypes.POLL_LOGS_SUCCEEDED, handleNewPollLogsSaga)
  yield fork(listenForApplications)
}

// _Application log listener
export function* listenForApplications() {
  try {
    while (true) {
      const action = yield take(logsTypes.FRESH_APPLICATIONS)
      console.log('_Application action:', action)
      const aaction = {
        payload: action.payload,
        applications: true,
      }
      yield call(handleNewPollLogsSaga, aaction)
    }
  } catch (error) {
    console.log('listenForApplications error:', error)
  }
}

export function* handleNewPollLogsSaga(action) {
  try {
    const allListings = yield select(selectAllListings)
    const logs = action.payload

    if (action.applications) {
      console.log(logs.length, '_Application logs:', logs)
      const listings = yield all(
        logs.map(aLog => createListing(aLog.logData, aLog.txData, aLog.msgSender))
      )
      const applications = yield call(updateListings, listings, allListings)

      yield put(actions.setListings(applications))
    } else {
      console.log(logs.length, 'assorted logs:', logs)
      const updatedListings = yield call(updateAssortedListings, logs, allListings)

      if (!updatedListings.equals(allListings)) {
        yield put(actions.setListings(updatedListings))
      } else {
        console.log('updatedListings.equals(allListings)')
      }
    }
  } catch (error) {
    console.log('error;', error)
  }
}
