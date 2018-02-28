import { call, put, all } from 'redux-saga/effects'
// import ipfsAPI from 'ipfs-api'

import {
  setContracts,
  contractError,
  updateBalancesRequest,
} from '../actions'

import { setupRegistry, setupContract } from '../libs/contracts';

function ipfsSaga() {
  // const ipfs = ipfsAPI('localhost', '5002', { protocol: 'http' })
  // const ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5002')

  // console.log('ipfs', ipfs)
  // const obj = {
  //   Data: new Buffer('aab'),
  //   Links: []
  // }

  // ipfs.object.put(obj, (err, node) => {
  //   if (err) {
  //     throw err
  //   }
  //   console.log(node.toJSON())
  //   // Logs:
  // })
  // const mH = 'QmPb5f92FxKPYdT3QNBd1GKiL4tZUXUrzF4Hkpdr3Gf1gK'
  // ipfs.object.get(mH, (err, node) => {
  //   if (err) {
  //     throw err
  //   }
  //   console.log(node.toJSON())
  // })

}
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

    yield put(setContracts({ parameters, contracts: { registry, token, voting, parameterizer } }))
    yield put(updateBalancesRequest())
  } catch (err) {
    console.log('err', err)
    yield put(contractError(err))
  }
}