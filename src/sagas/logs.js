import { select, takeLatest, all, call, put } from 'redux-saga/effects'
import _ from 'lodash'

import { SET_CONTRACTS } from 'actions/constants'
import { decodeLogs } from 'libs/logs'
import { updateListings } from 'libs/listings'

import { setListings } from '../actions'
import { selectProvider, selectRegistry, selectVoting } from '../selectors'

export default function* logsSaga() {
  yield takeLatest(SET_CONTRACTS, setupEventsSaga)
}

export function* setupEventsSaga() {
  const registry = yield select(selectRegistry)

  const {
    _Application,
    _Challenge,
    _NewListingWhitelisted,
    _ApplicationRemoved,
    _ListingRemoved,
  } = registry.interface.events

  const RegistryEvents = [
    _Application,
    _Challenge,
    _NewListingWhitelisted,
    _ApplicationRemoved,
    _ListingRemoved,
  ]

  yield call(getHistorySaga, RegistryEvents)
}

export function* getHistorySaga(ContractEvents) {
  const provider = yield select(selectProvider)
  const registry = yield select(selectRegistry)
  const voting = yield select(selectVoting)

  const freshListings = yield all(
    ContractEvents.map(async ContractEvent => {
      return decodeLogs(
        provider,
        registry,
        ContractEvent,
        voting,
        registry.address
      )
    })
  )

  const flattened = _.flatten(freshListings)
  console.log('flattened', flattened)

  const updatedListings = yield call(updateListings, [], flattened)
  console.log('updatedListings', updatedListings.toJS())

  yield put(setListings(updatedListings))
}
