import { call, put, all, select, takeLatest } from 'redux-saga/effects'

import abis from '../abis'

import {
  setContracts,
  contractError,
  updateBalancesRequest,
  setRegistryContract,
} from '../actions'

import { setupRegistry, setupContract } from '../libs/contracts'
import { baseToConvertedUnit } from '../utils/_units'
import { SET_REGISTRY_CONTRACT } from '../actions/constants'
import { selectEthjs, selectAccount } from '../selectors'

export default function* root() {
  yield takeLatest(SET_REGISTRY_CONTRACT, contractsSaga)
}

export function* initialRegistrySaga(ethjs, account) {
  const registry = yield call(setupRegistry, ethjs, account, abis.registry)
  yield put(setRegistryContract(registry))
}

export function* contractsSaga(action) {
  const ethjs = yield select(selectEthjs)
  const account = yield select(selectAccount)
  const registry = action.payload
  try {
    let [token, parameterizer, voting] = yield all([
      call(setupContract, ethjs, account, abis.token, registry, 'token'),
      call(setupContract, ethjs, account, abis.parameterizer, registry, 'parameterizer'),
      call(setupContract, ethjs, account, abis.voting, registry, 'voting'),
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
      call(parameterizer.get.call, 'minDeposit'),
      call(parameterizer.get.call, 'applyStageLen'),
      call(parameterizer.get.call, 'commitStageLen'),
      call(parameterizer.get.call, 'revealStageLen'),
      call(parameterizer.get.call, 'dispensationPct'),
      call(token.name.call),
      call(token.decimals.call),
      call(token.symbol.call),
      call(registry.name.call),
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
          tokenSymbol: tokenSymbol,
          tokenName: tokenName,
          tokenDecimals: tokenDecimals.toString(10),
          registryName,
        },
      })
    )
    yield put(updateBalancesRequest())
  } catch (err) {
    console.log('err', err)
    yield put(contractError(err))
  }
}
