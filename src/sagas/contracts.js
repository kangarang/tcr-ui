import { call, put, all } from 'redux-saga/effects'

import { setContracts, contractError, updateBalancesRequest } from '../actions'
import { setupRegistry, setupContract } from '../libs/contracts'
import { baseToConvertedUnit } from '../utils/_unit';

export function* contractsSaga(ethjs, account) {
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
      registryName,
    ] = yield all([
      call(parameterizer.contract.get.call, 'minDeposit'),
      call(parameterizer.contract.get.call, 'applyStageLen'),
      call(parameterizer.contract.get.call, 'commitStageLen'),
      call(parameterizer.contract.get.call, 'revealStageLen'),
      call(parameterizer.contract.get.call, 'dispensationPct'),
      call(token.contract.name.call),
      call(token.contract.decimals.call),
      call(token.contract.symbol.call),
      call(registry.contract.name.call),
    ])

    const parameters = {
      minDeposit: baseToConvertedUnit(minDeposit.toString(10), tokenDecimals),
      applyStageLen: applyStageLen.toString(10),
      commitStageLen: commitStageLen.toString(10),
      revealStageLen: revealStageLen.toString(10),
      dispensationPct: dispensationPct.toString(10),
    }

    token.symbol = yield tokenSymbol
    token.name = yield tokenName
    token.decimals = yield tokenDecimals
    registry.name = yield registryName

    yield put(
      setContracts({
        parameters,
        contracts: { registry, token, voting, parameterizer },
      })
    )
    yield put(updateBalancesRequest())
  } catch (err) {
    console.log('err', err)
    yield put(contractError(err))
  }
}
