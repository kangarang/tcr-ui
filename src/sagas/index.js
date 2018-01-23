import { call, put, fork, select, all, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import {
  GET_ETHEREUM,
  SET_WALLET,
  GET_ETH_PROVIDER,
  LOGIN_ERROR,
  WALLET_ERROR,
} from '../actions/constants'

import { setupContract, setupRegistry } from '../services'

import {
  setWallet,
  contractError,
  setContracts,
  getProviderRequest,
  setEthereumProvider,
  loginError,
  logoutSuccess,
} from '../actions'

import { tokensAllowedSaga } from './token'

import { setupEthjs, getEthjs } from '../libs/provider'

import loginSaga from './login'
import { selectAccount } from '../selectors/index'

export default function* rootSaga() {
  yield takeLatest(GET_ETHEREUM, genesis)
  yield fork(loginSaga)
  yield fork(runPolling)
  yield takeLatest(GET_ETH_PROVIDER, pollProvider)
}

function* genesis(action) {
  try {
    const eth = yield call(setupEthjs, action.network)
    const address = (yield call(eth.accounts))[0]
    const balanceBlockNetwork = yield call(getBalBlockNet, eth, address)
    if (balanceBlockNetwork) {
      yield put(setWallet(balanceBlockNetwork))
      yield fork(contractsSaga, eth, address)
    }
  } catch (err) {
    yield put(loginError({ type: LOGIN_ERROR, message: err.message }))
  }
}

function* getBalBlockNet(eth, address) {
  try {
    if (address) {
      const [blockNumber, ethBalance, network] = yield all([
        call(eth.blockNumber),
        call(eth.getBalance, address),
        call(eth.net_version),
      ])
      return yield { blockNumber, ethBalance, network, address }
    }
  } catch (err) {
    yield put(loginError({ type: WALLET_ERROR, message: err.message }))
  }
}

// Setup contracts

function* contractsSaga(eth, address) {
  try {
    const registry = yield call(setupRegistry, eth, address)
    console.log('registry', registry)
    const [token, parameterizer, voting] = yield all([
      call(setupContract, eth, address, 'token'),
      call(setupContract, eth, address, 'parameterizer'),
      call(setupContract, eth, address, 'voting'),
    ])
    console.log('token', token)
    if (token && parameterizer && registry && voting) {
      yield put(setContracts({ registry, token, parameterizer, voting }))
      yield fork(tokensAllowedSaga, registry.address)
    }
  } catch (err) {
    yield put(contractError(err))
  }
}

// Polling

function* runPolling() {
  const pollInterval = 2000
  while (true) {
    try {
      // Every 2 seconds:
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
    const eth = yield call(getEthjs)

    const account = yield select(selectAccount)
    const bbnAccount = yield call(getBalBlockNet, eth, account)

    const address = (yield call(eth.accounts))[0]
    const bbnAddress = yield call(getBalBlockNet, eth, address)

    if (typeof bbnAccount === 'undefined' && bbnAddress) {
      // login to MetaMask
      const balanceBlockNetwork = yield call(getBalBlockNet, eth, address)
      yield put(setEthereumProvider(balanceBlockNetwork))
      yield call(contractsSaga, eth, address)
    } else if (bbnAccount && typeof bbnAddress === 'undefined') {
      // logout of MetaMask
      yield put(logoutSuccess({ account: bbnAccount.address }))
    }
  } catch (err) {
    console.log('pollProvider error', err)
    yield put(contractError(err))
  }
}
