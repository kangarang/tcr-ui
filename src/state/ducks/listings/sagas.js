import { select, takeLatest, call, put } from 'redux-saga/effects'
import pickBy from 'lodash/fp/pickBy'

import { SET_CONTRACTS, updateBalancesStart } from 'state/home/actions'
import { selectProvider, selectRegistry } from 'state/home/selectors'

import {
  flattenAndSortByNestedBlockTimestamp,
  decodeLogs,
  convertDecodedLogs,
} from 'state/libs/logs'

import { setListings } from './actions'

export default function* rootLogsSaga() {
  yield takeLatest(SET_CONTRACTS, setupLogsSaga)
}

export function* setupLogsSaga() {
  try {
    const registry = yield select(selectRegistry)
    const {
      _Application,
      _Challenge,
      // _ChallengeSucceeded,
      // _ChallengeFailed,
      _ApplicationWhitelisted,
      _ApplicationRemoved,
      _ListingRemoved,
    } = registry.interface.events
    // get all applications
    const aLogs = yield call(decodeLogsSaga, _Application, registry.address)
    const applications = yield call(convertDecodedLogs, aLogs, {})

    const cLogs = yield call(decodeLogsSaga, _Challenge, registry.address)
    // const csLogs = yield call(decodeLogsSaga, _ChallengeSucceeded, registry.address)
    // const cfLogs = yield call(decodeLogsSaga, _ChallengeFailed, registry.address)
    const awLogs = yield call(decodeLogsSaga, _ApplicationWhitelisted, registry.address)
    const arLogs = yield call(decodeLogsSaga, _ApplicationRemoved, registry.address)
    const lrLogs = yield call(decodeLogsSaga, _ListingRemoved, registry.address)

    const logs = [
      cLogs,
      // csLogs,
      // cfLogs,
      awLogs,
      arLogs,
      lrLogs,
    ]
    console.log('logs', logs)
    const sorted = yield call(flattenAndSortByNestedBlockTimestamp, logs)
    console.log('flatsorted', sorted)
    const listings = yield call(convertDecodedLogs, sorted, applications)
    // console.log('listings', listings)
    const filteredListings = yield pickBy(li => li.status !== '0', listings)
    console.log('filteredListings', filteredListings)

    if (Object.keys(filteredListings).length > 0) {
      // DISPATCH
      yield put(setListings({ listings: filteredListings, byID: Object.keys(filteredListings) }))
      yield put(updateBalancesStart())
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
