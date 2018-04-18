import { call, put, all, select, takeLatest } from 'redux-saga/effects'

import { selectABIs, selectAccount } from 'state/ducks/home/selectors'
import actions from 'state/ducks/home/actions'
import types from 'state/ducks/home/types'
// import actions from '../actions'
// import types from '../types'

import { setupRegistry, setupContract } from 'state/libs/contracts'
import { getEthjs } from 'state/libs/provider'

import { baseToConvertedUnit } from 'state/libs/units'

export default function* root() {
  yield takeLatest(types.SET_ABIS, registrySaga)
  yield takeLatest(types.CHOOSE_TCR, registrySaga)
  yield takeLatest(types.SET_REGISTRY_CONTRACT, contractsSaga)
}

export function* registrySaga(action) {
  try {
    const abis = yield select(selectABIs)
    const account = yield select(selectAccount)

    const ethjs = yield call(getEthjs)
    const networkID = yield call(ethjs.net_version)

    // if action.payload.address, use that address (CHOOSE_TCR)
    // otherwise, use the default address (factory tcr)
    let { address } = action.payload || abis.registry.networks[networkID]

    const registry = yield call(
      setupRegistry,
      abis.registry.abi,
      abis.registry.bytecode,
      account,
      address
    )

    yield put(actions.setRegistryContract(registry))
  } catch (err) {
    console.log('registry saga err', err)
  }
}

function* contractsSaga(action) {
  try {
    const abis = yield select(selectABIs)
    const account = yield select(selectAccount)
    const registry = action.payload

    let [token, voting, parameterizer] = yield all([
      call(setupContract, abis.token.abi, abis.token.bytecode, account, registry, 'token'),
      call(setupContract, abis.voting.abi, abis.voting.bytecode, account, registry, 'voting'),
      call(
        setupContract,
        abis.parameterizer.abi,
        abis.parameterizer.bytecode,
        account,
        registry,
        'parameterizer'
      ),
    ])

    const [
      minDeposit,
      applyStageLen,
      commitStageLen,
      revealStageLen,
      dispensationPct,
      tokenNameResult,
      tokenDecimalsResult,
      tokenSymbolResult,
      registryNameResult,
    ] = yield all([
      call(parameterizer.get, 'minDeposit'),
      call(parameterizer.get, 'applyStageLen'),
      call(parameterizer.get, 'commitStageLen'),
      call(parameterizer.get, 'revealStageLen'),
      call(parameterizer.get, 'dispensationPct'),
      call(token.name),
      call(token.decimals),
      call(token.symbol),
      call(registry.name),
    ])

    const tokenDecimals = tokenDecimalsResult['0'].toString(10)

    const parameters = {
      minDeposit: baseToConvertedUnit(minDeposit['0'].toString(10), tokenDecimals),
      applyStageLen: applyStageLen['0'].toString(10),
      commitStageLen: commitStageLen['0'].toString(10),
      revealStageLen: revealStageLen['0'].toString(10),
      dispensationPct: dispensationPct['0'].toString(10),
    }

    yield put(
      actions.setContracts({
        parameters,
        contracts: {
          registry,
          token,
          voting,
          parameterizer,
        },
        tcr: {
          tokenSymbol: tokenSymbolResult['0'],
          tokenName: tokenNameResult['0'],
          tokenDecimals,
          registryName: registryNameResult['0'],
        },
      })
    )
    // refresh balances
    yield put(actions.updateBalancesRequest())
  } catch (err) {
    console.log('contract err', err)
  }
}
