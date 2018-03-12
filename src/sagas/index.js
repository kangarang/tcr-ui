import { call, put, takeLatest } from 'redux-saga/effects'

import { setWallet, loginError } from '../actions'
import { GET_ETHEREUM, LOGIN_ERROR } from '../actions/constants'

import { setProvider } from '../libs/provider'
import { initialRegistrySaga } from './contracts'

export default function* rootSaga() {
  yield takeLatest(GET_ETHEREUM, genesis)
}

function* genesis() {
  try {
    const provider = yield call(setProvider)
    console.log('provider', provider)
    const account = (yield provider.listAccounts())[0]
    console.log('account', account)
    const network =
      provider.chainId === 4
        ? 'RINKEBY'
        : provider.chainId === 1
          ? 'MAIN'
          : provider.chainId === '420' ? 'GANACHE' : 'UNKNOWN'
    if (account === undefined) {
      yield put(loginError({ type: LOGIN_ERROR, message: 'Need MetaMask!' }))
    } else {
      yield put(setWallet({ provider, account, network }))
      yield call(initialRegistrySaga, provider, account)
    }
  } catch (err) {
    console.log('Genesis error:', err)
    yield put(loginError({ type: LOGIN_ERROR, message: err.message }))
  }
}
