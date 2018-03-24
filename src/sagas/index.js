import { call, put, select, takeLatest } from 'redux-saga/effects'
// import { Organization } from '@governx/governx-lib'

import { GET_ETHEREUM, LOGIN_ERROR } from 'actions/constants'
import { setWallet, loginError } from '../actions'
import { setProvider } from 'libs/provider'
import { initialRegistrySaga } from 'sagas/contracts'
import { selectRegistry, selectAccount } from '../selectors'

export default function* rootSaga() {
  yield takeLatest(GET_ETHEREUM, genesis)
}

export function* genesis() {
  try {
    const provider = yield call(setProvider)
    // console.log('provider', provider)
    const account = (yield provider.listAccounts())[0]
    // console.log('account', account)
    const network =
      provider.chainId === 4
        ? 'rinkeby'
        : provider.chainId === 1
          ? 'main'
          : provider.chainId === '420' ? 'ganache' : 'unknown'

    if (account === undefined) {
      yield put(loginError({ type: LOGIN_ERROR, message: 'Need MetaMask!' }))
    } else {
      yield put(setWallet({ provider, account, network }))
      // TODO: remove abis and just get the meta tcr to initialize the ui
      yield call(initialRegistrySaga, provider, account)
      // yield call(governXSaga)
    }
  } catch (err) {
    console.log('Genesis error:', err)
    yield put(loginError({ type: LOGIN_ERROR, message: err.message }))
  }
}

function* governXSaga() {
  const registry = yield select(selectRegistry)
  const account = yield select(selectAccount)
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
