import { call, put, takeLatest } from 'redux-saga/effects'

import * as actions from '../actions'
import * as types from '../types'

import { getEthjs } from 'libs/provider'

export default function* rootSaga() {
  yield takeLatest(types.SETUP_ETHEREUM_START, genesis)
}

export function* genesis() {
  try {
    const ethjs = yield call(getEthjs)
    const networkID = yield call(ethjs.net_version)
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
