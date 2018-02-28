import { call, put, takeLatest } from 'redux-saga/effects'

import {
  GET_ETHEREUM,
  LOGIN_ERROR,
} from '../actions/constants'

import {
  setWallet,
  loginError,
} from '../actions'

import { setEthjs } from '../libs/provider'

import { contractsSaga } from './contracts';

export default function* rootSaga() {
  yield takeLatest(GET_ETHEREUM, genesis)
}

function* genesis() {
  try {
    const ethjs = yield call(setEthjs)
    const account = (yield call(ethjs.accounts))[0]
    const networkID = yield call(ethjs.net_version)

    yield put(setWallet({ ethjs, account, networkID }))
    yield call(contractsSaga, ethjs, account)
  } catch (err) {
    console.log('Genesis error:', err)
    yield put(loginError({ type: LOGIN_ERROR, message: err.message }))
  }
}