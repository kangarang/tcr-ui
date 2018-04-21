import { Map, fromJS } from 'immutable'
import { takeLatest, take, takeEvery, fork, call, put, select } from 'redux-saga/effects'

import * as logsTypes from '../logs/types'
import { selectAllListings } from '../home/selectors'

import * as actions from './actions'
import { convertDecodedLogs } from './utils'

export default function* rootListingsSaga() {
  yield takeEvery(logsTypes.POLL_LOGS_SUCCEEDED, handleNewPollLogsSaga)
  yield fork(listenForApplications)
}
export function* listenForApplications() {
  try {
    while (true) {
      const action = yield take(logsTypes.FRESH_APPLICATIONS)
      console.log('action:', action)
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

function* handleNewPollLogsSaga(action) {
  const logs = action.payload
  console.log(`${logs.length} logs`, logs)

  let allListings = yield select(selectAllListings)
  if (!action.applications) {
    allListings = fromJS({})
  }
  const convertedListings = (yield call(convertDecodedLogs, logs, allListings)).filter(
    each => each.size > 0
  )
  console.log('convertedListings:', convertedListings[0].toJS())
  if (convertedListings.length > 0) {
    yield put(actions.setListings(Map(convertedListings[0])))
  }
}
