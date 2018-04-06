import { call, put, all, select, takeLatest } from 'redux-saga/effects'
import {
  SET_REGISTRY_CONTRACT,
  setRegistryContract,
  setContracts,
  updateBalancesRequest,
  SET_ABIS,
  CHOOSE_TCR,
} from 'actions/home'
import { contractError } from '../actions'
import { setupRegistry, setupContract } from 'libs/contracts'
import { baseToConvertedUnit } from 'libs/units'
import { selectProvider, selectABIs } from 'selectors'

export default function* root() {
  yield takeLatest(SET_ABIS, registrySaga)
  yield takeLatest(SET_REGISTRY_CONTRACT, contractsSaga)

  yield takeLatest(CHOOSE_TCR, registrySaga)
}

export function* registrySaga(action) {
  try {
    const abis = yield select(selectABIs)
    const provider = yield select(selectProvider)
    const networkID = provider.chainId.toString()

    // if action was dispatched with a payload.address, use that address
    // otherwise, use the default address (factory tcr)
    let { address } = action.payload || abis.registry.networks[networkID]
    const registry = yield call(setupRegistry, provider, abis.registry.abi, address)

    yield put(setRegistryContract(registry))
  } catch (err) {
    console.log('registry saga err', err)
  }
}

function* contractsSaga(action) {
  try {
    const abis = yield select(selectABIs)
    const provider = yield select(selectProvider)
    const registry = action.payload

    let [token, parameterizer, voting] = yield all([
      call(setupContract, provider, abis.token.abi, registry, 'token'),
      call(setupContract, provider, abis.parameterizer.abi, registry, 'parameterizer'),
      call(setupContract, provider, abis.voting.abi, registry, 'voting'),
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
      registryName,
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

    const parameters = {
      minDeposit: baseToConvertedUnit(minDeposit.toString(10), tokenDecimals.toString(10)),
      applyStageLen: applyStageLen.toString(10),
      commitStageLen: commitStageLen.toString(10),
      revealStageLen: revealStageLen.toString(10),
      dispensationPct: dispensationPct.toString(10),
    }

    yield put(
      setContracts({
        parameters,
        contracts: {
          registry,
          token,
          voting,
          parameterizer,
        },
        tcr: {
          tokenSymbol,
          tokenName,
          tokenDecimals: tokenDecimals.toString(10),
          registryName,
        },
      })
    )
    // refresh balances
    yield put(updateBalancesRequest())
  } catch (err) {
    console.log('err', err)
    yield put(contractError(err))
  }
}
