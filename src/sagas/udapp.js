import EthAbi from 'ethjs-abi'

import { select, all, call, takeEvery } from 'redux-saga/effects'
import { SEND_TRANSACTION, CALL_REQUESTED } from '../actions/constants'

import {
  selectEthjs,
  selectAccount,
  selectRegistry,
  selectVoting,
} from '../selectors'

import unit_value_utils, { randInt } from '../utils/unit-value-conversions'

import vote_utils from '../utils/vote_utils'
import saveFile from '../utils/file_utils'

export default function* udappSaga() {
  yield takeEvery(SEND_TRANSACTION, sendEthjsTransaction)
  yield takeEvery(CALL_REQUESTED, callUDappSaga)
}

function* callUDappSaga(action) {
  console.log('action', action)
  const ethjs = yield select(selectEthjs)
  const account = yield select(selectAccount)

  let contract
  if (action.payload.contract === 'registry') {
    contract = yield select(selectRegistry)
  } else if (action.payload.contract === 'voting') {
    contract = yield select(selectVoting)
  }
  console.log('callUDapp contracts:', contract)

  const method = action.payload.method
  const args = action.payload.finalArgs
  const txData = yield call(EthAbi.encodeMethod, method, args)
  console.log('call txData', txData)

  const payload = {
    from: account,
    to: contract.address,
    data: txData,
  }

  const result = yield call(ethjs.call, payload, 'latest')
  const decint = parseInt(result, 10)
  const hexint = parseInt(result, 16)
  console.log('CALL (dec):', decint)
  console.log('CALL (hex):', hexint)

  const callResult = hexint === 0 ? 'false' : hexint === 1 ? 'true' : decint
  console.log('callresult', callResult)
}

// adapted from:
// https://github.com/kumavis/udapp/blob/master/index.js#L63
function* sendTransactionSaga(action) {
  try {
    const ethjs = yield select(selectEthjs)
    const account = yield select(selectAccount)
    console.log('action', action)

    let contract
    if (action.payload.contract === 'registry') {
      contract = yield select(selectRegistry)
    } else if (action.payload.contract === 'voting') {
      contract = yield select(selectVoting)
    }
    console.log('ethjs send TXN contract', contract)

    const method = yield action.payload.method
    const args = yield action.payload.finalArgs
    const nonce = yield call(ethjs.getTransactionCount, account)
    const txData = yield EthAbi.encodeMethod(method, args)
    console.log('send txn txData', txData)

    const payload = yield {
      from: account,
      gas: 450000,
      gasPrice: 25000000000,
      to: contract.address,
      data: txData,
      nonce,
    }
    const txHash = yield call(ethjs.sendTransaction, payload)
    console.log('txHash', txHash)
  } catch (error) {
    console.log('error', error)
  }
}



// Deprecated
// function* sendTransaction(action) {
//   const txType = action.payload.type
//   if (txType === 'tc') {
//     yield call(sendContractTransaction, action)
//   } else if (txType === 'ethjs') {
//     yield call(sendTransactionSaga, action)
//   }
// }

// function* sendContractTransaction(action) {
//   try {
//     const contract = yield select(selectContract(action.payload.contract))

//     const method = yield action.payload.method.name
//     const args = yield action.payload.finalArgs
//     console.log('SEND TX REQUEST', action)
//     console.log('method', method)

//     console.log('contract', contract)
//     const receipt = yield call([contract.contract, method], ...args)
//     console.log('receipt', receipt)
//   } catch (err) {
//     console.log('err', err)
//   }
// }
