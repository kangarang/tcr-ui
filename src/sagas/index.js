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

import { setupRegistry, setupContracts } from '../contracts'

import {
  setEthjs,
  contractError,
  setContracts,
  setMinDeposit,
} from '../actions'
import {
  selectEthjs,
  selectAccount,
} from '../selectors'

import registrySaga from './registry'
import tokenSaga, { tokensAllowedSaga } from './token'
import votingSaga from './voting'
import logsSaga from './logs'

import { getEthjs } from '../libs/provider'
import { toNineToken } from '../libs/units';

export default function* rootSaga() {
  yield takeLatest(GET_ETHEREUM, genesis)
  yield fork(registrySaga)
  yield fork(tokenSaga)
  yield fork(votingSaga)

}

function* genesis() {
  try {
    const eth = yield call(getEthjs)
    const account = yield call(eth.coinbase)

    const [blockNumber, ethBalance, network] = yield all([
      call(eth.blockNumber),
      call(eth.getBalance, account),
      call(eth.net_version),
    ])
    console.log('account', account)
    console.log('network', network)

    yield put(setEthjs(eth, { account, ethBalance, blockNumber, network }))

    yield fork(contractsSaga)
  } catch (err) {
    yield put(contractError(err))
  }
}

// Sets up contracts
function* contractsSaga() {
  try {
    const eth = yield select(selectEthjs)
    const account = yield select(selectAccount)

    const registry = yield call(setupRegistry, eth, account)
    const { token, parameterizer, voting } = yield call(
      setupContracts,
      eth,
      account,
      registry.contract
    )

    yield put(
      setContracts({
        registry,
        token,
        parameterizer,
        voting,
      })
    )
    // Sets canonical MIN_DEPOSIT
    yield put(setMinDeposit(parameterizer.minDeposit))
    // Gets tokens allowed
    yield fork(tokensAllowedSaga)
  } catch (err) {
    yield put(contractError(err))
  }
}
