import EthAbi from 'ethjs-abi'

import { select, call, takeEvery } from 'redux-saga/effects'
import { SEND_TRANSACTION, CALL_REQUESTED } from '../actions/constants'

import {
  selectEthjs,
  selectAccount,
  selectContract,
} from '../selectors'

export default function* udappSaga() {
  yield takeEvery(SEND_TRANSACTION, sendTransaction)
  yield takeEvery(CALL_REQUESTED, callUDappSaga)
}

function* callUDappSaga(action) {
  const ethjs = yield select(selectEthjs)
  const account = yield select(selectAccount)
  console.log('action', action)
  const method = yield action.payload.method
  const args = yield action.payload.finalArgs
  const txData = yield call(EthAbi.encodeMethod, method, args)
  const contract = yield select(selectContract(action.payload.contract))

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

function* sendTransaction(action) {
  const txType = action.payload.type
  if (txType === 'tc') {
    yield call(sendContractTransaction, action)
  }
  if (txType === 'ethjs') {
    yield call(sendEthjsTransaction, action)
  }
}

function* sendContractTransaction(action) {
  try {
    const contract = yield select(selectContract(action.payload.contract))

    const method = yield action.payload.method.name
    const args = yield action.payload.finalArgs
    console.log('SEND TX REQUEST', action)
    console.log('method', method)

    console.log('contract', contract)
    const receipt = yield call([contract.contract, method], ...args)
    console.log('receipt', receipt)
  } catch (err) {
    console.log('err', err)
  }
}

// adapted from:
// https://github.com/kumavis/udapp/blob/master/index.js#L63
function* sendEthjsTransaction(action) {
  const ethjs = yield select(selectEthjs)
  const account = yield select(selectAccount)
  const method = yield action.payload.method
  const args = yield action.payload.finalArgs
  const txData = yield call(EthAbi.encodeMethod, method, args)
  console.log('txData', txData)
  const nonce = yield call(ethjs.getTransactionCount, account)
  const contract = yield select(selectContract(action.payload.contract))
  console.log('contract', contract)
  const payload = {
    from: account,
    gas: 450000,
    gasPrice: 25000000000,
    to: contract.address,
    data: txData,
    nonce,
  }
  console.log('Tx Payload: ', payload)
  const txHash = yield call(ethjs.sendTransaction, payload)
  console.log('txHash', txHash)
}

// save file
// const pollStruct = await plcr.pollMap.call(pollID)

// const commitEndDateString = vote_utils.getEndDateString(pollStruct[0])
// const revealEndDateString = vote_utils.getEndDateString(pollStruct[1])

// const json = {
//   listing,
//   voteOption,
//   salt: salt.toString(10),
//   pollID,
//   pollStruct,
//   commitEndDateString,
//   revealEndDateString,
//   secretHash,
// }

// const listingUnderscored = listing.replace('.', '_')
// const filename = `${listingUnderscored}--pollID_${pollID}--commitEnd_${commitEndDateString}--commitVote.json`

// if (receipt.receipt.status !== '0x0') {
//   saveFile(json, filename)
//   return receipt
// }
