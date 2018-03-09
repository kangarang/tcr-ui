import { call, put, takeLatest } from 'redux-saga/effects'

import { setWallet, loginError } from '../actions'
import { GET_ETHEREUM, LOGIN_ERROR } from '../actions/constants'

import { setEthjs } from '../libs/provider'
import { initialRegistrySaga } from './contracts'

export default function* rootSaga() {
  yield takeLatest(GET_ETHEREUM, genesis)
}

function* genesis() {
  try {
    const ethjs = yield call(setEthjs)
    const account = (yield call(ethjs.accounts))[0]
    const networkID = yield call(ethjs.net_version)
    const network =
      networkID === '4'
        ? 'RINKEBY'
        : networkID === '1'
          ? 'MAIN NET'
          : networkID === '420' ? 'GANACHE' : 'UNKNOWN NETWORK'
    if (account === undefined) {
      yield put(loginError({ type: LOGIN_ERROR, message: 'Need MetaMask!' }))
    } else {
      yield put(setWallet({ ethjs, account, network }))
      yield call(initialRegistrySaga, ethjs, account)
    }
  } catch (err) {
    console.log('Genesis error:', err)
    yield put(loginError({ type: LOGIN_ERROR, message: err.message }))
  }
}
