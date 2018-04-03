import { select, takeLatest, call, put } from 'redux-saga/effects'
import _ from 'lodash'

import { setListings } from 'actions'
import { setApplications } from 'libs/listings'
import {
  flattenAndSortByNestedBlockTimestamp,
  decodeLogs,
  getBlockAndTxnFromLog,
  convertDecodedLogs,
} from '../libs/logs'

import { selectProvider, selectRegistry, selectVoting, selectAllListings } from '../selectors'
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
    const aEvents = yield call(convertDecodedLogs, aLogs, {})
    const applications = yield call(setApplications, {}, aEvents)

    // build the list
    const cLogs = yield call(decodeLogsSaga, _Challenge, registry.address)
    const awLogs = yield call(decodeLogsSaga, _ApplicationWhitelisted, registry.address)
    const arLogs = yield call(decodeLogsSaga, _ApplicationRemoved, registry.address)
    const lrLogs = yield call(decodeLogsSaga, _ListingRemoved, registry.address)

    const logs = [cLogs, awLogs, arLogs, lrLogs]
    const sorted = yield call(flattenAndSortByNestedBlockTimestamp, logs)
    const listings = yield call(convertDecodedLogs, sorted, applications)
    const updatedApplications = yield call(setApplications, applications, listings)
    const filteredListings = yield updatedApplications.filter(li => li.get('status') !== '0')
    // console.log('logs', logs)
    // console.log('flat, sorted', sorted)
    // console.log('listings', listings)
    // console.log('updatedListings', updatedListings)

    if (filteredListings.size > 0) {
      console.log('filteredListings', filteredListings.toJS())
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
