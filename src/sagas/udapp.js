import EthAbi from 'ethjs-abi'

import { select, all, call, takeEvery } from 'redux-saga/effects'
import { SEND_TRANSACTION, CALL_REQUESTED } from '../actions/constants'

import {
  selectEthjs,
  selectAccount,
  selectRegistry,
  selectVoting,
} from '../selectors'
import value_utils, { randInt } from '../utils/value_utils'
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
function* sendEthjsTransaction(action) {
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

    const method = yield action.payload.method
    const args = yield action.payload.finalArgs
    const nonce = yield call(ethjs.getTransactionCount, account)
    const txData = yield EthAbi.encodeMethod(method, args)
    console.log('send txn txData', txData)
    console.log('contract', contract)

    const payload = yield {
      from: account,
      gas: 450000,
      gasPrice: 25000000000,
      to: contract.address,
      data: txData,
      nonce,
    }
    console.log('Tx Payload: ', payload)
    if (method.name === 'commitVote') {
      const txHash = yield call(saveFileSaga, action, args, payload)
      console.log('file save + txHash:', txHash)
    } else {
      const txHash = yield call(ethjs.sendTransaction, payload)
      console.log('txHash', txHash)
    }
  } catch (error) {
    console.log('error', error)
  }
}

function* saveFileSaga(action, args, payload) {
  const ethjs = yield select(selectEthjs)
  const voting = yield select(selectVoting)
  const pollStruct = yield call(voting.pollMap.call, args[0])

  const commitEndDateString = vote_utils.getEndDateString(pollStruct[0])
  const revealEndDateString = vote_utils.getEndDateString(pollStruct[1])

  const salt = randInt(1e6, 1e8)
  const secretHash = vote_utils.getVoteSaltHash(args[0], action.payload.listing)

  const json = {
    listing: action.payload.listing,
    voteOption: args[1],
    salt: salt.toString(10),
    pollID: args[0],
    pollStruct,
    commitEndDateString,
    revealEndDateString,
    secretHash,
  }

  const listingUnderscored = json.listing.replace('.', '_')
  const filename = `${listingUnderscored}--pollID_${
    json.pollID
  }--commitEnd_${commitEndDateString}--commitVote.json`

  const txHash = yield call(ethjs.sendTransaction, payload)

  if (txHash !== '0x0') {
    yield saveFile(json, filename)
    return txHash
  }
}

// Deprecated
// function* sendTransaction(action) {
//   const txType = action.payload.type
//   if (txType === 'tc') {
//     yield call(sendContractTransaction, action)
//   } else if (txType === 'ethjs') {
//     yield call(sendEthjsTransaction, action)
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
