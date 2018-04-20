import axios from 'axios'
import { takeLatest, take, fork, call, put, select } from 'redux-saga/effects'

import * as logsTypes from '../logs/types'
// import { SET_REGISTRY_CONTRACT } from '../ethProvider/types'
import { selectAllListings, selectRegistry, selectNetwork } from '../home/selectors'

import * as actions from './actions'
import { convertDecodedLogs } from './utils'

export default function* rootListingsSaga() {
  // yield takeLatest(logsTypes.POLL_LOGS_SUCCEEDED, createListingsSaga)
  yield fork(createListingsSaga)
  // yield takeLatest(SET_REGISTRY_CONTRACT, fetchGovernXSaga)
}

function* createListingsSaga() {
  try {
    const allListings = yield select(selectAllListings)
    while (true) {
      const action = yield take(logsTypes.POLL_LOGS_SUCCEEDED)
      const logs = action.payload
      console.log(`${logs.length} logs`, logs)

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

export function* fetchGovernXSaga() {
  try {
    const registry = yield select(selectRegistry)
    const network = yield select(selectNetwork)
    // get a user notified via email on your TCR
    const res = yield axios
      .get('https://api.governx.org/notify', {
        params: {
          network,
          organization: registry.address,
          email: 'isaac.kang@consensys.net',
          url: 'https://isaackang.net',
        },
      })
      .then(console.log)
      .catch(console.log)
  } catch (error) {
    console.log('fetchGovernXSaga error:', error)
  }
}
