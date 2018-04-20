import { select, takeLatest, call, put } from 'redux-saga/effects'

import * as actions from './actions'
import * as homeActions from 'state/ducks/home/actions'
import * as liActions from 'state/ducks/listings/actions'

import * as logsTypes from 'state/ducks/logs/types'
import * as epTypes from 'state/ducks/ethProvider/types'

import { convertDecodedLogs } from './utils'

export default function* rootListingsSaga() {
  yield takeLatest(logsTypes.POLL_LOGS_SUCCEEDED, createListingsSaga)
}

function* createListingsSaga(action) {
  const logs = action.payload
  console.log(logs.length, 'logs:', logs)

  const listings = yield call(convertDecodedLogs, logs, {})
  console.log('listings:', listings)

  const byID = Object.keys(listings)
  yield put(liActions.setListings({ listings, byID }))
}
