import { call, put, fork, all, spawn, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import { GET_ETHEREUM, GET_ETH_PROVIDER, LOGIN_ERROR, WALLET_ERROR } from '../actions/constants'

import { setupContract, setupRegistry } from '../services'

import { setWallet, contractError, setContracts, getProviderRequest, loginError } from '../actions'

import { updateTokenBalancesSaga } from './token'

import { setupEthjs } from '../utils/provider_utils'

import signinSaga from './signin'

export default function* rootSaga() {
  yield takeLatest(GET_ETHEREUM, genesis)
  yield fork(signinSaga)
  yield fork(runPolling)
  yield takeLatest(GET_ETH_PROVIDER, pollProvider)
}

function* genesis() {
  try {
    const ethjs = yield call(setupEthjs)
    const address = (yield call(ethjs.accounts))[0]
    console.log('address', address)
    const balanceBlockNetwork = yield call(getBalBlockNet, ethjs, address)

    if (typeof balanceBlockNetwork !== 'undefined') {
      yield put(setWallet(balanceBlockNetwork))
      yield spawn(contractsSaga, ethjs, address)
    }
  } catch (err) {
    yield put(loginError({ type: LOGIN_ERROR, message: err.message }))
  }
}

function* getBalBlockNet(ethjs, address) {
  try {
    if (address) {
      const [blockNumber, ethBalance, network] = yield all([
        call(ethjs.blockNumber),
        call(ethjs.getBalance, address),
        call(ethjs.net_version),
      ])
      return yield { blockNumber, ethBalance, network, address, ethjs }
    }
  } catch (err) {
    yield put(loginError({ type: WALLET_ERROR, message: err.message }))
  }
}

function* contractsSaga(ethjs, address) {
  try {
    const registry = yield call(setupRegistry, ethjs, address)

    const [token, parameterizer, voting] = yield all([
      call(setupContract, ethjs, address, registry, 'token'),
      call(setupContract, ethjs, address, registry, 'parameterizer'),
      call(setupContract, ethjs, address, registry, 'voting'),
    ])
    yield put(setContracts({ registry, token, parameterizer, voting }))
    yield fork(updateTokenBalancesSaga, registry.address)
    yield fork(updateTokenBalancesSaga, voting.address)
  } catch (err) {
    console.log('err', err)
    yield put(contractError(err))
  }
}

// Polling

function* runPolling() {
  const pollInterval = 10000
  while (true) {
    try {
      // Every 10 seconds:
      yield call(delay, pollInterval)
      // Dispatch: check provider request
      yield put(getProviderRequest())
    } catch (e) {
      throw new Error(e)
    }
  }
}

function* pollProvider() {
  try {
    // const ethjs = yield select(selectEthjs)
    // const account = yield select(selectAccount)
    // const bbnAccount = yield call(getBalBlockNet, ethjs, account)
    // if (typeof bbnAccount === 'undefined' && bbnAddress) {
    //   // login to MetaMask
    //   const balanceBlockNetwork = yield call(getBalBlockNet, ethjs, address)
    //   yield put(setEthereumProvider(balanceBlockNetwork))
    //   yield call(contractsSaga, ethjs, address)
    // } else if (bbnAccount && typeof bbnAddress === 'undefined') {
    //   // logout of MetaMask
    //   yield put(logoutSuccess({ account: bbnAccount.address }))
    // } else if (bbnAccount.defaultAccount !== bbnAddress.defaultAccount) {
    //   const balanceBlockNetwork = yield call(getBalBlockNet, ethjs, address)
    //   yield put(setEthereumProvider(balanceBlockNetwork))
    //   yield fork(contractsSaga, ethjs, address)
    // }
  } catch (err) {
    console.log('pollProvider error', err)
    yield put(contractError(err))
  }
}
