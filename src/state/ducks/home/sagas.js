import { call, fork, put, takeLatest } from 'redux-saga/effects'

import types from './types'
import actions from './actions'

import balancesSaga from 'state/ducks/ethProvider/sagas/index'
import contractsSagas from 'state/ducks/ethProvider/sagas/contracts'
import logsSagas from 'state/ducks/logs/sagas'
import transactionsSagas from 'state/ducks/transactions/sagas'

import { setEthjs, setEthersProvider } from 'state/libs/provider'

export default function* rootSaga() {
  // init other root sagas
  yield fork(balancesSaga)
  yield fork(contractsSagas)
  yield fork(logsSagas)
  yield fork(transactionsSagas)

  // home sagas
  yield takeLatest(types.SETUP_ETHEREUM_START, genesis)
}

export function* genesis() {
  try {
    const ethjs = yield call(setEthjs)
    const account = (yield call(ethjs.accounts))[0]
    const networkID = yield call(ethjs.net_version)
    yield call(setEthersProvider, parseInt(networkID, 10))
    const network =
      networkID === '4'
        ? 'rinkeby'
        : networkID === '1' ? 'mainnet' : networkID === '420' ? 'ganache' : 'unknown'

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
