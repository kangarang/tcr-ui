import { call, fork, put, takeLatest } from 'redux-saga/effects'

import * as actions from '../actions'
import * as types from '../types'

import balancesSaga from './balances'
import contractsSagas from './contracts'
import logsSagas from 'modules/logs/sagas'
import listingsSagas from 'modules/listings/sagas'
import transactionsSagas from 'modules/transactions/sagas'

import { setEthjs, setEthersProvider } from 'libs/provider'

export default function* rootSaga() {
  // init root sagas
  yield fork(balancesSaga)
  yield fork(contractsSagas)
  yield fork(logsSagas)
  yield fork(listingsSagas)
  yield fork(transactionsSagas)

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
        : networkID === '1'
          ? 'mainnet'
          : networkID === '420' || networkID === '9001'
            ? 'ganache'
            : 'unknown'
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
