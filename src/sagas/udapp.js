import EthAbi from 'ethjs-abi'

import { select, all, call, takeEvery } from 'redux-saga/effects'
import { SEND_TRANSACTION, CALL_REQUESTED, TX_APPLY, TX_CHALLENGE, TX_COMMIT_VOTE, TX_REVEAL_VOTE, TX_REQUEST_VOTING_RIGHTS } from '../actions/constants'

import {
  selectEthjs,
  selectAccount,
  selectRegistry,
  selectVoting,
} from '../selectors'

import unit_value_utils, { randInt } from '../utils/unit-value-conversions'

import vote_utils from '../utils/vote_utils'
import { saveFile } from '../utils/file_utils'

export default function* udappSaga() {
  yield takeEvery(SEND_TRANSACTION, sendTransaction)
  yield takeEvery(TX_REQUEST_VOTING_RIGHTS, requestVotingRightsSaga)
  yield takeEvery(CALL_REQUESTED, callUDappSaga)
  yield takeEvery(TX_APPLY, applySaga)
  yield takeEvery(TX_CHALLENGE, challengeSaga)
  yield takeEvery(TX_COMMIT_VOTE, commitVoteSaga)
  yield takeEvery(TX_REVEAL_VOTE, revealVoteSaga)
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
  const args = action.payload.args
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

function* applySaga(action) {
  const registry = yield select(selectRegistry)

  const listingString = action.payload.args[0]
  const actualAmount = unit_value_utils.toNaturalUnitAmount(action.payload.args[1], 18)
  const listingHash = vote_utils.getListingHash(listingString)

  const finalArgs = [listingHash, actualAmount, listingString]

  const txData = EthAbi.encodeMethod(action.payload.method, finalArgs)
  const to = registry.address

  yield call(sendTransactionSaga, txData, to)
}
function* challengeSaga(action) {
  const listingString = action.payload.args[0]
  const listingHash = vote_utils.getListingHash(listingString)
  const finalArgs = [listingHash, listingString]

  const txData = EthAbi.encodeMethod(action.payload.method, finalArgs)

  const registry = yield select(selectRegistry)

  yield call(sendTransactionSaga, txData, registry.address)
}
function* commitVoteSaga(action) {
  const account = yield select(selectAccount)
  const voting = yield select(selectVoting)

  const pollID = action.payload.args[0]
  const voteOption = action.payload.args[1]
  const numTokens = action.payload.args[2]
  // const numTokens = unit_value_utils.toNaturalUnitAmount(action.payload.args[2], 18)

  const salt = randInt(1e6, 1e8)
  const secretHash = vote_utils.getVoteSaltHash(voteOption, salt.toString(10))
  console.log('voting', voting)
  const prevPollID = yield call(voting.contract.getInsertPointForNumTokens.call, account, numTokens)
  console.log('prevPollID', prevPollID)

  const finalArgs = [pollID, secretHash, numTokens.toString(10), prevPollID.toString(10)]

  console.log('finalArgs', finalArgs)
  const txData = EthAbi.encodeMethod(action.payload.method, finalArgs)

  yield call(sendTransactionSaga, txData, voting.address)
}
function* revealVoteSaga(action) {
  console.log('reveal action', action)
  // const listingString = action.payload.args[0]
  // const actualAmount = unit_value_utils.toNaturalUnitAmount(action.payload.args[1], 18)
  // const listingHash = vote_utils.getListingHash(listingString)
  // const finalArgs = [listingHash, actualAmount, listingString]

  // const txData = EthAbi.encodeMethod(action.payload.method, finalArgs)

  // const registry = yield select(selectRegistry)
  // const to = registry.address

  // yield call(sendTransactionSaga, txData, to)
}
function* requestVotingRightsSaga(action) {
  try {
    const ethjs = yield select(selectEthjs)
    const from = yield select(selectAccount)
    const voting = yield select(selectVoting)

    const tokens = unit_value_utils.toNaturalUnitAmount(action.payload.args[0], 18)

    const nonce = yield call(ethjs.getTransactionCount, from)
    const txData = EthAbi.encodeMethod(action.payload.method, [tokens])

    yield call(sendTransactionSaga, txData, voting.address)
  } catch (error) {
    console.log('error', error)
  }
}
function* sendTransactionSaga(data, to) {
  console.log('send data', data)
  try {
    const ethjs = yield select(selectEthjs)
    const from = yield select(selectAccount)

    const nonce = yield call(ethjs.getTransactionCount, from)

    const payload = {
      to,
      from,
      gas: 450000,
      gasPrice: 25000000000,
      nonce,
      data,
    }

    const txHash = yield call(ethjs.sendTransaction, payload)
    console.log('txHash', txHash)
  } catch (error) {
    console.log('error', error)
  }
}
function* sendTransaction(action) {
}