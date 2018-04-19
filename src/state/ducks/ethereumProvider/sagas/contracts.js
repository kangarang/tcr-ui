import { call, put, all, select, takeLatest } from 'redux-saga/effects'

import { selectABIs, selectAccount } from 'state/ducks/home/selectors'
import actions from 'state/ducks/home/actions'
import types from 'state/ducks/home/types'
// import actions from '../actions'
// import types from '../types'

import { setupRegistry, setupContract } from 'state/libs/contracts'
import { getEthjs } from 'state/libs/provider'
import { ipfsGetData } from 'state/libs/ipfs'

import { baseToConvertedUnit } from 'state/libs/units'

export default function* contractsSagasRoot() {
  yield takeLatest(types.SET_ABIS, registrySaga)
  yield takeLatest(types.CHOOSE_TCR, registrySaga)
  yield takeLatest(types.SET_REGISTRY_CONTRACT, contractsSaga)
  yield takeLatest(types.SETUP_ETHEREUM_SUCCEEDED, abisSaga)
}

function* abisSaga() {
  try {
    // get abis from ipfs
    const data = yield call(ipfsGetData, 'QmZpeget91fUBZyw9LfhwvB3X5iPTkWLiTtRioWcdrU1LE')
    const { id, registry, token, voting, parameterizer } = data
    const abis = {
      id,
      registry: { abi: registry.abi, bytecode: registry.bytecode, networks: registry.networks },
      token: { abi: token.abi, bytecode: token.bytecode },
      voting: { abi: voting.abi, bytecode: voting.bytecode },
      parameterizer: { abi: parameterizer.abi, bytecode: parameterizer.bytecode },
    }

    // dispatch abis -> invokes contractSagas
    yield put(actions.setABIs(abis))
  } catch (error) {
    console.log('set abis error:', error)
  }
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
    yield put(actions.updateBalancesStart())
  } catch (err) {
    console.log('contract err', err)
  }
}
