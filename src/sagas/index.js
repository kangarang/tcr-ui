import {
  call,
  put,
  fork,
  // select,
  all,
  takeLatest,
} from 'redux-saga/effects'
import { delay } from 'redux-saga'
import {
  GET_ETHEREUM, SET_WALLET,
  GET_PROVIDER_REQUEST,
} from '../actions/constants'

import { setupContract, setupRegistry } from '../contracts'

import {
  setWallet,
  contractError,
  setContracts,
  getProviderRequest,
  setEthjs,
} from '../actions'
import {
  // selectAccount,
} from '../selectors'

import registrySaga from './registry'
import tokenSaga, { tokensAllowedSaga } from './token'
import votingSaga from './voting'

import { setupEthjs, getEthjs } from '../libs/provider'

export default function* rootSaga() {
  yield takeLatest(GET_ETHEREUM, genesis)
  yield takeLatest(SET_WALLET, initPoll)
  yield takeLatest(GET_PROVIDER_REQUEST, pollProvider)
  yield fork(registrySaga)
  yield fork(tokenSaga)
  yield fork(votingSaga)
}

function* genesis() {
  try {
    const eth = yield call(setupEthjs)
    const address = (yield call(eth.accounts))[0]

    const [blockNumber, ethBalance, network] = yield all([
      call(eth.blockNumber),
      call(eth.getBalance, address),
      call(eth.net_version),
    ])
    console.log('address', address)
    console.log('network', network)


    yield put(setWallet({ address, ethBalance, blockNumber, network }))
    yield call(contractsSaga, eth, address)
  } catch (err) {
    yield put(contractError(err))
  }
}

function* initPoll() {
  yield all([
    put(getProviderRequest()),
    call(runPolling),
  ])
}
function* runPolling() {
  const pollInterval = 5000
  while (true) {
    try {
      yield call(delay, pollInterval)
      yield put(getProviderRequest())
    } catch (e) {
      throw new Error(e)
    }
  }
}

function* pollProvider() {
  try {
    const eth = yield call(getEthjs)
    const address = (yield call(eth.accounts))[0]
    const [ethBalance, network] = yield all([
      call([eth, 'getBalance'], address),
      call([eth, 'net_version'])
    ])
    const obj = {
      ethBalance,
      network,
      address,
    }
    yield put(setEthjs(obj))
  } catch (err) {
    console.log('pollProvider error', err)
    yield put(contractError(err))
  }
}

// Sets up contracts
function* contractsSaga(eth, address) {
  const registry = yield call(setupRegistry, eth, address)
  try {
    const [token, parameterizer, voting] = yield all([
      call(setupContract, eth, address, 'token'),
      call(setupContract, eth, address, 'parameterizer'),
      call(setupContract, eth, address, 'voting')
    ])
    yield put(setContracts({ registry, token, parameterizer, voting }))

    // Gets tokens allowed
    yield fork(tokensAllowedSaga, registry.address)
  } catch (err) {
    yield put(contractError(err))
  }
}