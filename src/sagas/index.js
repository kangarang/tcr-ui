import { call, put, select, takeLatest } from 'redux-saga/effects'
import { ipfsGetData } from 'libs/ipfs'
// import { Organization } from '@governx/governx-lib'
import { LOGIN_ERROR } from '../actions/constants'
import { loginError } from '../actions'
import { setWallet, GET_ETHEREUM, setABIs } from 'actions/home'
import { setProvider } from 'libs/provider'
import { selectRegistry, selectAccount } from 'selectors'

export default function* rootSaga() {
  yield takeLatest(GET_ETHEREUM, genesis)
}

export function* genesis() {
  try {
    let provider
    if (process.env.NODE_ENV === 'development') {
      provider = yield call(setProvider, 420)
    } else {
      provider = yield call(setProvider)
    }
    const account = (yield provider.listAccounts())[0]
    const network =
      provider.chainId === 4
        ? 'rinkeby'
        : provider.chainId === 1 ? 'mainnet' : provider.chainId === 420 ? 'ganache' : 'unknown'
    yield put(setWallet({ provider, account, network }))

    const data = yield call(ipfsGetData, 'QmeCTiFp7VUgPBnxQcWfNjrxFeh9eeScSx8VUKE2344beo')
    yield put(setABIs(data))
    // yield call(governXSaga)
  } catch (err) {
    console.log('Genesis error:', err)
    yield put(loginError({ type: LOGIN_ERROR, message: 'Need MetaMask' }))
  }
}

export function* governXSaga() {
  const registry = yield select(selectRegistry)
  console.log('registry', registry)
  const account = yield select(selectAccount)
  console.log('account', account)
  // console.log('registry, account', registry, account)
  // const { tcr } = new Organization({
  //   address: registry.address,
  //   from: account,
  //   network,
  // })
  // console.log('tcr', tcr)
  // const result = yield tcr.get()
  // console.log('result', result)
}
