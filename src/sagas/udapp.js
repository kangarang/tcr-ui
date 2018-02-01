import EthAbi from 'ethjs-abi'

import { put, select, call, take, fork, takeLatest, takeEvery } from 'redux-saga/effects'
import { CLICK_ACTION_REQUEST, SEND_TRANSACTION } from '../actions/constants'

import { selectCustomMethods } from '../actions'
import {
  selectParameters,
  selectEthjs,
  selectAccount,
  selectContracts,
  selectContract,
} from '../selectors'
import { getContract } from '../services/index'

export default function* udappSaga() {
  yield takeLatest(CLICK_ACTION_REQUEST, clickSaga)
  yield takeEvery(SEND_TRANSACTION, sendTransaction)
}

function* clickSaga(action) {
  console.log('user action:', action)
  try {
    const { method, listing, pollID } = action.payload

    const customMethods = ['commitVote']
    yield put(selectCustomMethods({ customMethods, method, listing, pollID }))
  } catch (err) {
    console.log('err', err)
  }
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
  const contract = yield call(getContract, action.payload.contract)
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
