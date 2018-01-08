import {
  call,
  put,
  fork,
  select,
  all,
  takeLatest,
} from 'redux-saga/effects'
import {
  GET_ETHEREUM,
} from '../actions/constants'

import { getRegistry, setupContract, setupRegistry } from '../contracts'

import {
  setWallet,
  contractError,
  setContracts,
} from '../actions'
import {
  selectAccount,
} from '../selectors'

import registrySaga from './registry'
import tokenSaga, { tokensAllowedSaga } from './token'
import votingSaga from './voting'

import { setupEthjs, getEthjs } from '../libs/provider'

export default function* rootSaga() {
  yield takeLatest(GET_ETHEREUM, genesis)
  yield fork(registrySaga)
  yield fork(tokenSaga)
  yield fork(votingSaga)
}

function* genesis() {
  try {
    const eth = yield call(setupEthjs)
    const address = yield call(eth.coinbase)

    const [blockNumber, ethBalance, network] = yield all([
      call(eth.blockNumber),
      call(eth.getBalance, address),
      call(eth.net_version),
    ])
    console.log('address', address)
    console.log('network', network)

    yield put(setWallet({ address, ethBalance, blockNumber, network }))
    yield call(contractsSaga)
  } catch (err) {
    yield put(contractError(err))
  }
}

// Sets up contracts
function* contractsSaga() {
  try {
    const eth = yield call(getEthjs)
    const account = yield select(selectAccount)
    const registry = yield call(setupRegistry, eth, account)
    console.log('registry', registry)

    const [token, parameterizer, voting] = yield all([
      call(setupContract, eth, account, 'token'),
      call(setupContract, eth, account, 'parameterizer'),
      call(setupContract, eth, account, 'voting'),
    ])
    yield put(setContracts({ registry, token, parameterizer, voting }))

    // Gets tokens allowed
    yield fork(tokensAllowedSaga, registry.address)
  } catch (err) {
    yield put(contractError(err))
  }
}