import { call, fork, put, takeLatest } from 'redux-saga/effects'
// import { Organization } from '@governx/governx-lib'

import { setEthjs } from 'state/libs/provider'

import types from '../types'
import actions from '../actions'

import contractsSagas from 'state/ducks/ethereumProvider/sagas/contracts'
import balancesSaga from './balances'
import transactionsSagas from 'state/ducks/transactions/sagas'
import { setEthersProvider } from 'state/libs/provider'

export default function* rootSaga() {
  // init other root sagas
  yield fork(contractsSagas)
  yield fork(balancesSaga)
  yield fork(transactionsSagas)

  // home sagas
  yield takeLatest(types.SETUP_ETHEREUM_START, genesis)
}

export function* genesis() {
  try {
    const ethjs = yield call(setEthjs)
    const account = (yield call(ethjs.accounts))[0]
    const networkID = yield call(ethjs.net_version)
    const ethersProvider = yield call(setEthersProvider, parseInt(networkID))
    const network =
      networkID === '4'
        ? 'rinkeby'
        : networkID === '1' ? 'mainnet' : networkID === '420' ? 'ganache' : 'unknown'

    if (account === undefined) {
      // yield put(actions.loginError({ type: LOGIN_ERROR, message: 'Need MetaMask!' }))
      throw new Error('Account undefined')
    } else {
      // dispatch account/network
      yield put(actions.setupEthereumSucceeded({ account, network }))
    }
    // yield call(governXSaga)
  } catch (error) {
    yield put(actions.setupEthereumFailed({ error }))
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
