import axios from 'axios'
import { call, fork, select, put, takeLatest } from 'redux-saga/effects'

import * as types from './types'
import * as actions from './actions'
import { selectRegistry, selectNetwork } from './selectors'

import balancesSaga from 'state/ducks/ethProvider/sagas/index'
import contractsSagas from 'state/ducks/ethProvider/sagas/contracts'
import logsSagas from 'state/ducks/logs/sagas'
import listingsSagas from 'state/ducks/listings/sagas'
import transactionsSagas from 'state/ducks/transactions/sagas'

import { setEthjs, setEthersProvider } from 'state/libs/provider'

export default function* rootSaga() {
  // init other root sagas
  yield fork(balancesSaga)
  yield fork(contractsSagas)
  yield fork(logsSagas)
  yield fork(listingsSagas)
  yield fork(transactionsSagas)

  // home sagas
  yield takeLatest(types.SETUP_ETHEREUM_START, genesis)
}

export function* genesis() {
  try {
    const ethjs = yield call(setEthjs)
    const networkID = yield call(ethjs.net_version)
    yield call(setEthersProvider, parseInt(networkID, 10))
    const network =
      networkID === '4'
        ? 'rinkeby'
        : networkID === '1' ? 'mainnet' : networkID === '420' ? 'ganache' : 'unknown'
    const account = (yield call(ethjs.accounts))[0]

    if (account === undefined) {
      throw new Error('Account undefined')
    } else {
      // dispatch account/network
      yield put(actions.setupEthereumSucceeded({ account, network }))
    }
  } catch (error) {
    yield put(actions.setupEthereumFailed({ error }))
  }
}

export function* governXNotifications() {
  try {
    const registry = yield select(selectRegistry)
    const network = yield select(selectNetwork)
    // get a user notified via email on your TCR
    yield axios.get('https://api.governx.org/notify', {
      params: {
        network,
        organization: registry.address,
        email: 'isaac.kang@consensys.net',
        url: 'https://isaackang.net',
      },
    })
  } catch (error) {
    console.log('fetchGovernXSaga error:', error)
  }
}
