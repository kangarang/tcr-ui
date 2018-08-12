import { select, takeLatest, call, put, fork } from 'redux-saga/effects'
import { removeAll } from 'react-notification-system-redux'

// -retreat
import { updateListings, transformListings } from 'modules/listings/utils'
import { selectAllListings } from 'modules/listings/selectors'
import { homeTypes, homeSelectors } from 'modules/home'
import { logsToListings } from 'modules/listings/sagas'
import * as liActions from 'modules/listings/actions'

import rootPollLogsSaga, { initPolling } from './poll'
import { getSortedLogsSaga } from './utils'
import * as actions from '../actions'

export default function* rootLogsSaga() {
  yield fork(rootPollLogsSaga)
  yield takeLatest(homeTypes.SET_ALL_CONTRACTS, getFreshLogs)
}

// Initializes application state using logs
// emitted from: Registry, PLCRVoting, Parameterizer
function* getFreshLogs() {
  try {
    // clear notifications
    yield put(removeAll())

    const account = yield select(homeSelectors.selectAccount)
    const network = yield select(homeSelectors.selectNetwork)
    const registry = yield select(homeSelectors.selectRegistry)
    const voting = yield select(homeSelectors.selectVoting)
    const parameterizer = yield select(homeSelectors.selectParameterizer)
    const currentListings = yield select(selectAllListings)

    // block range to search
    const blockRange = {
      fromBlock: network === 'mainnet' ? 5000000 : 0,
      toBlock: 'latest',
    }

    // get sorted logs from all contracts
    const sortedRegistryLogs = yield call(getSortedLogsSaga, blockRange, [], registry)
    const sortedVotingLogs = yield call(getSortedLogsSaga, blockRange, [], voting)
    const sortedParamLogs = yield call(getSortedLogsSaga, blockRange, [], parameterizer)

    // Filter: (_Application logs)
    const applicantLogs = sortedRegistryLogs.filter(
      log => log.eventName === '_Application'
    )
    // Filter: !(_Application logs)
    const otherRegLogs = sortedRegistryLogs.filter(
      log => log.eventName !== '_Application'
    )

    // Create applications (listings)
    const applications = yield call(logsToListings, applicantLogs)

    // Convert applications to an Immutable Map of candidates
    const candidates = yield call(updateListings, applications)

    // concatenated w/ !(_Application logs)
    const accumulationLogs = otherRegLogs.concat(sortedVotingLogs)

    // change the relevant listings
    const updatedListings = yield call(
      transformListings,
      accumulationLogs,
      candidates,
      account
    )
    console.log('Listings:', updatedListings.toJS())

    if (currentListings.equals(updatedListings)) {
      console.log('State has not changed since last reload.')
      yield put(liActions.setAllListings(updatedListings))
    }
    // dispatch: set the up-to-date state of the contracts

    // initialize polling for more logs
    yield call(initPolling)
  } catch (err) {
    yield put(actions.pollLogsFailed(err))
  }
}
