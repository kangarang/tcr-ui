import { call, put, select, takeLatest } from 'redux-saga/effects'
// import { Organization } from '@governx/governx-lib'

import { setEthjs } from 'state/libs/provider'
import { ipfsCat } from 'state/libs/ipfs'

import types from './types'
import { selectRegistry, selectAccount } from './selectors'

// import logSaga from './sagas/logs'
// import tokenSaga from './sagas/token'
// import voteSaga from './sagas/vote'
// import contractsSaga from './sagas/contracts'
// import transactionSaga from './sagas/transaction'
// import eventsSaga from './sagas/events'

export default function* rootSaga() {
  yield takeLatest(types.SETUP_ETHEREUM_REQUEST, genesis)
}

export function* genesis() {
  try {
    const ethjs = yield call(setEthjs)
    console.log('ethjs', ethjs)
    const account = (yield call(ethjs.accounts))[0]
    console.log('account', account)
    const networkID = yield call(ethjs.net_version)
    console.log('networkID', networkID)
    const network =
      networkID === '4'
        ? 'rinkeby'
        : networkID === '1' ? 'mainnet' : networkID === '420' ? 'ganache' : 'unknown'
    console.log('network', network)

    // if (account === undefined) {
    //   // yield put(loginError({ type: LOGIN_ERROR, message: 'Need MetaMask!' }))
    //   console.log('HOME ERROR: account undefined')
    // } else {
    //   yield put(setWallet({ ethjs, account, network }))
    //   // yield call(initialRegistrySaga, ethjs, account)

    //   const data = yield call(ipfsCat, 'QmeCTiFp7VUgPBnxQcWfNjrxFeh9eeScSx8VUKE2344beo')
    //   yield put(setABIs(data))
    // }
    // yield call(governXSaga)
  } catch (err) {
    console.log('Genesis error:', err)
    // yield put(loginError({ type: LOGIN_ERROR, message: 'Need MetaMask' }))
  }
}

// export function* governXSaga() {
//   const registry = yield select(selectRegistry)
//   console.log('registry', registry)
//   const account = yield select(selectAccount)
//   console.log('account', account)
//   // console.log('registry, account', registry, account)
//   // const { tcr } = new Organization({
//   //   address: registry.address,
//   //   from: account,
//   //   network,
//   // })
//   // console.log('tcr', tcr)
//   // const result = yield tcr.get()
//   // console.log('result', result)
// }
