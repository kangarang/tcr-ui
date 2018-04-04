import { select, takeLatest, call, put } from 'redux-saga/effects'
import _ from 'lodash'

import { setListings } from '../actions'
import { setApplications } from 'libs/listings'
import { flattenAndSortByNestedBlockTimestamp, decodeLogs, convertDecodedLogs } from '../libs/logs'

import { selectProvider, selectRegistry } from '../selectors'
import { SET_CONTRACTS } from '../actions/constants'
import { updateBalancesRequest } from '../actions'

export default function* rootLogsSaga() {
  yield takeLatest(SET_CONTRACTS, setupLogsSaga)
}

export function* setupLogsSaga() {
  try {
    const registry = yield select(selectRegistry)
    const {
      _Application,
      _Challenge,
      _ApplicationWhitelisted,
      _ApplicationRemoved,
      _ListingRemoved,
    } = registry.interface.events

    // get all applications
    const aLogs = yield call(decodeLogsSaga, _Application, registry.address)
    const applications = yield call(convertDecodedLogs, aLogs, {})

    const cLogs = yield call(decodeLogsSaga, _Challenge, registry.address)
    const awLogs = yield call(decodeLogsSaga, _ApplicationWhitelisted, registry.address)
    const arLogs = yield call(decodeLogsSaga, _ApplicationRemoved, registry.address)
    const lrLogs = yield call(decodeLogsSaga, _ListingRemoved, registry.address)

    const logs = [cLogs, awLogs, arLogs, lrLogs]
    console.log('logs', logs)
    const sorted = yield call(flattenAndSortByNestedBlockTimestamp, logs)
    // console.log('flatsorted', sorted)
    const listings = yield call(convertDecodedLogs, sorted, applications)
    // console.log('listings', listings)
    const filteredListings = yield _.pickBy(listings, li => li.status !== '0')
    console.log('filteredListings', filteredListings)

    if (Object.keys(filteredListings).length > 0) {
      // DISPATCH
      yield put(setListings(filteredListings))
      yield put(updateBalancesRequest())
    }
  } catch (error) {
    console.log('setupLogsSaga error', error)
  }
}

function* decodeLogsSaga(ContractEvent, contractAddress) {
  try {
    const provider = yield select(selectProvider)
    const decodedLogs = yield call(decodeLogs, provider, ContractEvent, contractAddress)
    // console.log(ContractEvent.name, 'logs', decodedLogs)
    return decodedLogs
  } catch (error) {
    console.log('decodeLogsSaga error', error)
  }
}
