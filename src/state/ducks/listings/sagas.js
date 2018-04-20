import { takeLatest, take, fork, call, put, select } from 'redux-saga/effects'

import * as logsTypes from '../logs/types'
import { selectAllListings } from '../home/selectors'

import * as actions from './actions'
import { convertDecodedLogs } from './utils'

export default function* rootListingsSaga() {
  // yield takeLatest(logsTypes.POLL_LOGS_SUCCEEDED, createListingsSaga)
  yield fork(createListingsSaga)
}

function* createListingsSaga() {
  try {
    const allListings = yield select(selectAllListings)
    while (true) {
      const action = yield take(logsTypes.POLL_LOGS_SUCCEEDED)
      const logs = action.payload
      console.log(logs.length, 'logs:', logs)

      const listings = yield call(convertDecodedLogs, logs, {})
      console.log('listings:', listings)

      const byID = Object.keys(listings)
      if (byID.length > 0) {
        yield put(actions.setListings({ listings, byID }))
      }
    }
  } catch (error) {
    console.log('createListingsSaga error:', error)
  }
}
