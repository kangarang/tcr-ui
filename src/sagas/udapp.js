import {
  call,
  put,
  fork,
  select,
  all,
  takeLatest,
} from 'redux-saga/effects'
import { delay } from 'redux-saga'

import metamask from 'metamascara'

import ObsStore from 'obs-store'
import ComposedStore from 'obs-store/lib/composed'
import EthQuery from 'eth-query'
import EthStore from 'eth-store'
import EthAbi from 'ethjs-abi'
import EthBlockTracker from 'eth-block-tracker'

import {
  GET_ETHEREUM,
  EXECUTE_METH,
  REFRESH_ETH_STORE,
} from '../actions/constants'
import {
  setFromAddress,
} from '../actions/udapp'

import {
  selectDeposit,
  selectAddress,
  selectFromAddress,
  selectValues,
} from '../selectors/udapp';

import ABIs from '../contracts'
import { getEthjs } from '../libs/provider'

export default function* udappSaga() {
  // yield takeLatest(GET_ETHEREUM, genesis)
  // yield takeLatest(EXECUTE_METH, executeMeth)
  // yield takeLatest(REFRESH_ETH_STORE, subscribeEthStoreToAbi)
}

function* genesis() {
  const provider = yield metamask.createDefaultProvider({})
  startApp(provider)
}

function startApp(provider) {

  const ethQuery = global.ethQuery = new EthQuery(provider)

  const blockTracker = new EthBlockTracker({ provider })
  blockTracker.on('block', (block) => console.log('block #' + Number(block.number)))
  blockTracker.start()

  // setup eth-store (blockchain state)
  const ethStore = global.ethStore = new EthStore(blockTracker, provider)
  global.ethStore = ethStore

  // abi-store
  const abiStore = global.abiStore = new ObsStore()

  // view store (in query params)
  const viewStore = global.viewStore = new ObsStore()

  // auxillary data store (not in query params)
  const auxStore = global.auxStore = new ObsStore({
    fromAddress: undefined,
    events: [],
  })

  // root app store
  const appStore = global.appStore = new ComposedStore({
    abi: abiStore,
    view: viewStore,
    eth: ethStore,
    aux: auxStore,
  })

  // poll for latest account
  refreshAddress()
}

function* refreshAddress() {
  const eth = yield call(getEthjs)
  const account = (yield call(eth.accounts))[0]
  yield put(setFromAddress(account))
  yield call(delay, 1500)
  yield call(refreshAddress)
  // function refreshAddress() {
  //   ethQuery.accounts((err, accounts) => {
  //     if (err) throw err
  //     const newAccount = accounts[0]
  //     const currentAccount = auxStore.getState().fromAddress
  //     if (newAccount === currentAccount) return
  //     actions.setFromAddress(newAccount)
  //   })
  // }
}

function* subscribeEthStoreToAbi() {
  const abi = ABIs.Registry.abi
  const contractAddress = yield select(selectAddress)
  const fromAddress = yield select(selectFromAddress)
  const methods = abi.filter(int => int.type === 'function')

  global.ethStore.put('logs', (block) => ({
    method: 'eth_getLogs',
    params: [{
      address: contractAddress,
      fromBlock: block ? block.number : 'latest',
    }],
  }))

  // subscribe to method result
  methods.forEach((method) => {
    console.log('method', method)

    global.ethStore.put(method.name, getPayload)

    function* getPayload(block){
      const args = yield select(selectValues)
      try {
        const txData = EthAbi.encodeMethod(method, args)
        console.log(method.name, 'getPayload:', args)
        return {
          method: 'eth_call',
          params: [{
            from: fromAddress,
            to: contractAddress,
            data: txData,
          }, block ? block.number : 'latest'],
        }
      } catch (err) {
        if (args.filter(Boolean).length !== args.length) return
        console.warn(err)
      }
    }
  })
}


function* executeMeth(action) {

  // yield select(selectProvider)
  // yield select(selectDeposit)

  // const args = readArgumentsFromDom(action.method)
  // console.log('args', args)
  // try {
  //   const appState = appStore.getState()
  //   console.log('appState', appState)
  //   const toAddress = appState.view.address
  //   const fromAddress = appState.aux.fromAddress

  //   console.log('encode:', action.method.name, args)
  //   const txData = EthAbi.encodeMethod(action.method, args)
  //   const payload = {
  //     id: 1,
  //     action.method: 'eth_sendTransaction',
  //     params: [{
  //       from: fromAddress,
  //       to: toAddress,
  //       data: txData,
  //     }],
  //   }
  //   console.log('exec:', action.method.name, args, payload)
  //   provider.sendAsync(payload, console.log)
  // } catch (err) {
  //   console.warn(err)
  // }
  // try {
  //   const eth = yield call(setupEthjs)
  //   const address = (yield call(eth.accounts))[0]

  //   const [blockNumber, ethBalance, network] = yield all([
  //     call(eth.blockNumber),
  //     call(eth.getBalance, address),
  //     call(eth.net_version),
  //   ])
  //   console.log('address', address)
  //   console.log('network', network)


  //   yield put(setWallet({ address, ethBalance, blockNumber, network }))
  //   yield call(contractsSaga, eth, address)
  // } catch (err) {
  //   yield put(contractError(err))
  // }
}
