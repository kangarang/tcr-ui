import {
  call,
  put,
  fork,
  // select,
  all,
  takeLatest,
} from 'redux-saga/effects'
import {
  GET_ETHEREUM,
} from '../actions/constants'

import { setupContract, setupRegistry } from '../contracts'

import {
  setWallet,
  contractError,
  setContracts,
} from '../actions'
import {
  // selectAccount,
} from '../selectors'

import registrySaga from './registry'
import tokenSaga, { tokensAllowedSaga } from './token'
import votingSaga from './voting'

import { setupEthjs } from '../libs/provider'

export default function* rootSaga() {
  yield takeLatest(GET_ETHEREUM, genesis)
  yield fork(registrySaga)
  yield fork(tokenSaga)
  yield fork(votingSaga)
}

function* genesis() {
  try {
    const eth = yield call(setupEthjs)
    const account = yield call(eth.coinbase)

    const [blockNumber, ethBalance, network] = yield all([
      call(eth.blockNumber),
      call(eth.getBalance, account),
      call(eth.net_version),
    ])
    console.log('account', account)
    console.log('network', network)

    yield put(setWallet({ account, ethBalance, blockNumber, network }))
    yield call(contractsSaga, eth, account)
  } catch (err) {
    yield put(contractError(err))
  }
}

// Sets up contracts
function* contractsSaga(eth, account) {
  try {
    const registry = yield call(setupRegistry, eth, account)

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