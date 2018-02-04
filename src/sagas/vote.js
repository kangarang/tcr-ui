import EthAbi from 'ethjs-abi'

import { select, all, call, takeEvery } from 'redux-saga/effects'
import {
  SEND_TRANSACTION,
  CALL_REQUESTED,
  TX_COMMIT_VOTE,
  TX_REVEAL_VOTE,
} from '../actions/constants'

import {
  selectEthjs,
  selectAccount,
  selectRegistry,
  selectVoting,
} from '../selectors'

import unit_value_utils, { randInt } from '../utils/unit-value-conversions'

import vote_utils from '../utils/vote_utils'
import saveFile from '../utils/file_utils'

export default function* voteSaga() {
  yield takeEvery(TX_COMMIT_VOTE, commitVoteSaga)
  yield takeEvery(TX_REVEAL_VOTE, revealVoteSaga)
}

function* commitVoteSaga(action) {
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
    console.log('commitVote contracts:', contract)
    const method = yield action.payload.method
    const args = yield action.payload.finalArgs

    const txHash = yield call(saveFileSaga, action, args)

    if (!txHash) {
      console.log('no txHash')
    } else {
      console.log('file save + txHash:', txHash)
    }
  } catch (error) {
    console.log('error', error)
  }
}

function* saveFileSaga(action, args) {
  const ethjs = yield select(selectEthjs)
  const voting = yield select(selectVoting)
  const account = yield select(selectAccount)

  const pollID = args[0]
  const voteOption = args[1]
  const numTokens = args[2]

  // grab the correct position in the DLL
  const prevPollID = yield call(
    voting.contract.getInsertPointForNumTokens.call,
    account,
    numTokens
  )

  // grab the poll from the mapping
  const pollStruct = yield call(voting.pollMap.call, pollID)
  // record expiry dates
  const commitEndDateString = vote_utils.getEndDateString(pollStruct[0])
  const revealEndDateString = vote_utils.getEndDateString(pollStruct[1])

  // random salt/secretHash generator
  const salt = randInt(1e6, 1e8)
  const secretHash = vote_utils.getVoteSaltHash(voteOption, salt)

  const json = {
    listing: action.payload.listing,
    voteOption,
    salt: salt.toString(10),
    pollID,
    pollStruct,
    commitEndDateString,
    revealEndDateString,
    secretHash,
  }

  const listingUnderscored = json.listing.replace('.', '_')
  const filename = `${listingUnderscored}--pollID_${
    json.pollID
  }--commitEnd_${commitEndDateString}--commitVote.json`

  // Actual commitVote transaction
  const receipt = yield call(
    voting.contract.commitVote,
    pollID,
    secretHash,
    numTokens,
    prevPollID
  )

  if (receipt.receipt.status !== '0x0') {
    saveFile(json, filename)
    return receipt
  }
  return false

  // ethjs version (with usual payload: { nonce, data, to from, gas, ...etc}
  // const txHash = yield call(ethjs.sendTransaction, ethjsPayload)

  // if (txHash !== '0x0') {
  //   yield saveFile(json, filename)
  //   return txHash
  // }
}

function* revealVoteSaga(action) {
  // console.log('action', action)
  // const ethjs = yield select(selectEthjs)
  // const account = yield select(selectAccount)

  // let contract
  // if (action.payload.contract === 'registry') {
  //   contract = yield select(selectRegistry)
  // } else if (action.payload.contract === 'voting') {
  //   contract = yield select(selectVoting)
  // }

  // const method = action.payload.method
  // const args = action.payload.finalArgs
  // const txData = yield call(EthAbi.encodeMethod, method, args)
  // console.log('call txData', txData)

  // const payload = {
  //   from: account,
  //   to: contract.address,
  //   data: txData,
  // }

  // const result = yield call(ethjs.call, payload, 'latest')
  // const decint = parseInt(result, 10)
  // const hexint = parseInt(result, 16)
  // console.log('CALL (dec):', decint)
  // console.log('CALL (hex):', hexint)
  // const callResult = hexint === 0 ? 'false' : hexint === 1 ? 'true' : decint
  // console.log('callresult', callResult)
}
