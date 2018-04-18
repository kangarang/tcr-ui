import { call, put, takeLatest } from 'redux-saga/effects'
// import { Organization } from '@governx/governx-lib'

import { setEthjs } from 'state/libs/provider'
import { ipfsGetData } from 'state/libs/ipfs'

import types from './types'
import actions from './actions'

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
    const account = (yield call(ethjs.accounts))[0]
    const networkID = yield call(ethjs.net_version)
    const network =
      networkID === '4'
        ? 'rinkeby'
        : networkID === '1' ? 'mainnet' : networkID === '420' ? 'ganache' : 'unknown'

    if (account === undefined) {
      // yield put(loginError({ type: LOGIN_ERROR, message: 'Need MetaMask!' }))
      console.log('HOME ERROR: account undefined')
    } else {
      // set wallet/network
      yield put(actions.setWallet({ account, network }))
      // get abis from ipfs
      const abis = yield call(ipfsGetData, 'QmeCTiFp7VUgPBnxQcWfNjrxFeh9eeScSx8VUKE2344beo')
      console.log('abis:', abis)
      // dispatch abis -> invokes contractSagas
      yield put(actions.setABIs(abis))
    }
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
