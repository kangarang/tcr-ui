import { takeLatest, take, takeEvery, fork, call, put, select } from 'redux-saga/effects'

import * as logsTypes from '../logs/types'
import { selectAllListings } from '../home/selectors'

import * as actions from './actions'
import { convertDecodedLogs } from './utils'

export default function* rootListingsSaga() {
  // yield fork(createListingsSaga)
  yield takeEvery(logsTypes.POLL_LOGS_SUCCEEDED, createListingsSaga)
}

function* createListingsSaga(action) {
  try {
    const allListings = yield select(selectAllListings)
    // while (true) {
    // const action = yield take(logsTypes.POLL_LOGS_SUCCEEDED)
    const logs = action.payload
    console.log(`${logs.length} logs`, logs)

    const listings = yield call(convertDecodedLogs, logs, allListings)
    console.log('listings:', listings)

    const byID = Object.keys(listings)
    if (byID.length > 0) {
      yield put(actions.setListings({ listings, byID }))
    }
    // }
  } catch (error) {
    console.log('createListingsSaga error:', error)
  }
}
