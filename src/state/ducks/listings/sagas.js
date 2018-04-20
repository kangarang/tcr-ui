import { select, takeLatest, call, put } from 'redux-saga/effects'
import pickBy from 'lodash/fp/pickBy'

import actions from './actions'
import homeActions from 'state/ducks/home/actions'
import types from 'state/ducks/ethProvider/types'
import { selectRegistry } from 'state/ducks/home/selectors'

import {
  flattenAndSortByNestedBlockTimestamp,
  decodeLogs,
  convertDecodedLogs,
} from 'state/libs/logs'

export default function* rootLogsSaga() {
  yield takeLatest(types.SET_CONTRACTS, setupLogsSaga)
}

export function* setupLogsSaga() {
  try {
    const registry = yield select(selectRegistry)
    // const aLogs = yield call(decodeLogsSaga, _Application, registry.address)
    // const applications = yield call(convertDecodedLogs, aLogs, {})

    // const cLogs = yield call(decodeLogsSaga, _Challenge, registry.address)

    // const logs = [
    //   cLogs,
    // ]
    // console.log('logs', logs)
    // const sorted = yield call(flattenAndSortByNestedBlockTimestamp, logs)
    // const listings = yield call(convertDecodedLogs, sorted, applications)
    // const filteredListings = yield pickBy(li => li.status !== '0', listings)

    // if (Object.keys(filteredListings).length > 0) {
    //   // DISPATCH
    //   yield put(actions.setListings({ listings: filteredListings, byID: Object.keys(filteredListings) }))
    //   yield put(homeActions.updateBalancesStart())
    // }
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
