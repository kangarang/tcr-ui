import { call, fork, put, takeLatest } from 'redux-saga/effects'
// import { Organization } from '@governx/governx-lib'

import { setEthjs } from 'state/libs/provider'
import { ipfsGetData } from 'state/libs/ipfs'

import types from '../types'
import actions from '../actions'

import contractSagas from 'state/ducks/ethereumProvider/sagas/contracts'
import balancesSaga from './balances'
// import eventsSaga from './sagas/events'

export default function* rootSaga() {
  yield fork(contractSagas)
  yield fork(balancesSaga)
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
      // yield put(actions.loginError({ type: LOGIN_ERROR, message: 'Need MetaMask!' }))
      console.log('HOME ERROR: account undefined')
    } else {
      // dispatch account/network
      yield put(actions.setWallet({ account, network }))

      // get abis from ipfs
      const data = yield call(ipfsGetData, 'QmeCTiFp7VUgPBnxQcWfNjrxFeh9eeScSx8VUKE2344beo')
      const { id, registry, token, voting, parameterizer } = data
      const abis = {
        id,
        registry: { abi: registry.abi, bytecode: registry.bytecode, networks: registry.networks },
        token: { abi: token.abi, bytecode: token.bytecode },
        voting: { abi: voting.abi, bytecode: voting.bytecode },
        parameterizer: { abi: parameterizer.abi, bytecode: parameterizer.bytecode },
      }

      // dispatch abis -> invokes contractSagas
      yield put(actions.setABIs(abis))
    }
    // yield call(governXSaga)
  } catch (err) {
    console.log('Genesis error:', err)
    // yield put(actions.loginError({ type: LOGIN_ERROR, message: 'Need MetaMask' }))
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
