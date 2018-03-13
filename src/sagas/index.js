import { call, put, takeLatest } from 'redux-saga/effects'

import { setWallet, loginError } from '../actions'
import { GET_ETHEREUM, LOGIN_ERROR } from '../actions/constants'

import abis from '../abis'
import { setProvider } from '../libs/provider'
import { initialRegistrySaga } from './contracts'
import { Organization } from '@governx/governx-lib'

export default function* rootSaga() {
  yield takeLatest(GET_ETHEREUM, genesis)
}

export function* genesis() {
  try {
    const provider = yield call(setProvider)
    console.log('provider', provider)
    const account = (yield provider.listAccounts())[0]
    console.log('account', account)
    const network =
      provider.chainId === 4
        ? 'rinkeby'
        : provider.chainId === 1
          ? 'main'
          : provider.chainId === '420' ? 'ganache' : 'unknown'

    const { tcr } = new Organization({
      address: abis.registry.networks[provider.chainId.toString()].address,
      from: account,
      network,
    })
    console.log('tcr', tcr)

    const result = yield tcr.get()
    console.log('result', result)

    // if (account === undefined) {
    //   yield put(loginError({ type: LOGIN_ERROR, message: 'Need MetaMask!' }))
    // } else {
    //   yield put(setWallet({ provider, account, network }))
    //   yield call(initialRegistrySaga, provider, account)
    // }
  } catch (err) {
    console.log('Genesis error:', err)
    yield put(loginError({ type: LOGIN_ERROR, message: err.message }))
  }
}
