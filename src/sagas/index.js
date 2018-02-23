import { call, put, fork, all, takeLatest, takeEvery } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import {
  GET_ETHEREUM,
  GET_ETH_PROVIDER,
  LOGIN_ERROR,
  WALLET_ERROR,
} from '../actions/constants'

import { setupContract, setupRegistry } from '../libs/contracts'

import {
  setWallet,
  contractError,
  setContracts,
  getProviderRequest,
  loginError,
} from '../actions'

import { updateTokenBalancesSaga } from './token'

import { setEthjs } from '../utils/provider_utils'

import signinSaga from './signin'

export default function* rootSaga() {
  yield takeLatest(GET_ETHEREUM, genesis)
  yield fork(signinSaga)
  yield fork(runPolling)
  yield takeEvery(GET_ETH_PROVIDER, pollProvider)
}

function* genesis() {
  try {
    const ethjs = yield call(setEthjs)
    const account = (yield call(ethjs.accounts))[0]
    // console.log('account', account)

    const balanceBlockNetwork = yield call(getBalBlockNet, ethjs, account)

    if (typeof balanceBlockNetwork !== 'undefined') {
      yield put(setWallet(balanceBlockNetwork))
      yield fork(contractsSaga, ethjs, account)
    }
  } catch (err) {
    yield put(loginError({ type: LOGIN_ERROR, message: err.message }))
  }
}

function* getBalBlockNet(ethjs, account) {
  try {
    if (account) {
      const [blockNumber, ethBalance, network] = yield all([
        call(ethjs.blockNumber),
        call(ethjs.getBalance, account),
        call(ethjs.net_version),
      ])
      return yield { blockNumber, ethBalance, network, account, ethjs }
    }
  } catch (err) {
    yield put(loginError({ type: WALLET_ERROR, message: err.message }))
  }
}

function* contractsSaga(ethjs, account) {
  try {
    const registry = yield call(setupRegistry, ethjs, account)

    let [token, parameterizer, voting] = yield all([
      call(setupContract, ethjs, account, registry.contract, 'token'),
      call(setupContract, ethjs, account, registry.contract, 'parameterizer'),
      call(setupContract, ethjs, account, registry.contract, 'voting'),
    ])

    const [
      minDeposit,
      applyStageLen,
      commitStageLen,
      revealStageLen,
      dispensationPct,
      tokenName,
      tokenDecimals,
      tokenSymbol,
    ] = yield all([
      call(parameterizer.contract.get.call, 'minDeposit'),
      call(parameterizer.contract.get.call, 'applyStageLen'),
      call(parameterizer.contract.get.call, 'commitStageLen'),
      call(parameterizer.contract.get.call, 'revealStageLen'),
      call(parameterizer.contract.get.call, 'dispensationPct'),
      call(token.contract.name.call),
      call(token.contract.decimals.call),
      call(token.contract.symbol.call),
    ])

    const parameters = {
      minDeposit: yield minDeposit.toString(10),
      applyStageLen: applyStageLen.toString(10),
      commitStageLen: commitStageLen.toString(10),
      revealStageLen: revealStageLen.toString(10),
      dispensationPct: dispensationPct.toString(10),
    }

    token.symbol = yield tokenSymbol
    token.name = yield tokenName
    token.decimals = yield tokenDecimals

    yield put(setContracts({ registry, token, parameterizer, voting, parameters }))
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
    //   const balanceBlockNetwork = yield call(getBalBlockNet, ethjs, account)
    //   yield put(setEthereumProvider(balanceBlockNetwork))
    //   yield call(contractsSaga, ethjs, account)
    // } else if (bbnAccount && typeof bbnAddress === 'undefined') {
    //   // logout of MetaMask
    //   yield put(logoutSuccess({ account: bbnAccount.account }))
    // } else if (bbnAccount.defaultAccount !== bbnAddress.defaultAccount) {
    //   const balanceBlockNetwork = yield call(getBalBlockNet, ethjs, account)
    //   yield put(setEthereumProvider(balanceBlockNetwork))
    //   yield fork(contractsSaga, ethjs, account)
    // }
  } catch (err) {
    console.log('pollProvider error', err)
    yield put(contractError(err))
  }
}
