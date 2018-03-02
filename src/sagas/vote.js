import EthAbi from 'ethjs-abi'

import { select, call, takeEvery } from 'redux-saga/effects'
import {
  TX_REQUEST_VOTING_RIGHTS,
  TX_COMMIT_VOTE,
  TX_REVEAL_VOTE,
} from '../actions/constants'

import {
  // selectEthjs,
  selectAccount,
  selectRegistry,
  selectVoting,
} from '../selectors'

import { randInt, toNaturalUnitAmount } from '../utils/units_utils'

import vote_utils from '../utils/vote_utils'
import saveFile from '../utils/file_utils'
import { sendTransactionSaga } from './udapp'

export default function* voteSaga() {
  yield takeEvery(TX_REQUEST_VOTING_RIGHTS, requestVotingRightsSaga)
  yield takeEvery(TX_COMMIT_VOTE, commitVoteSaga)
  yield takeEvery(TX_REVEAL_VOTE, revealVoteSaga)
}


export function* requestVotingRightsSaga(action) {
  try {
    const voting = yield select(selectVoting)
    console.log('request voting rights saga action', action)
    const tokens = yield call(toNaturalUnitAmount, action.payload.args[0], 18)
    const txData = EthAbi.encodeMethod(action.payload.method, [tokens])
    // const receipt = yield call(voting.contract.requestVotingRights, tokens.toString(10))
    // console.log('receipt', receipt)
    yield call(sendTransactionSaga, txData, voting.address)
  } catch (error) {
    console.log('error', error)
  }
}


export function* commitVoteSaga(action) {
  const account = yield select(selectAccount)
  const voting = yield select(selectVoting)

  console.log('commit vote saga:', action)
  const pollID = action.payload.args[0]
  const voteOption = action.payload.args[1]
  const numTokens = action.payload.args[2]
  // const numTokens = toNaturalUnitAmount(action.payload.args[2], 18)

  const salt = randInt(1e6, 1e8)
  // format args
  const secretHash = vote_utils.getVoteSaltHash(voteOption, salt.toString(10))
  const prevPollID = yield call(voting.contract.getInsertPointForNumTokens.call, account, numTokens)
  const finalArgs = [pollID, secretHash, numTokens.toString(10), prevPollID.toString(10)]
  console.log('finalArgs', finalArgs)

  // const txData = EthAbi.encodeMethod(action.payload.method, finalArgs)

  // grab the poll from the mapping
  const pollStruct = yield call(voting.contract.pollMap.call, pollID)
  console.log('pollStruct', pollStruct)

  // record expiry dates
  const commitEndDateString = vote_utils.getEndDateString(
    pollStruct[0].toNumber()
  )
  const revealEndDateString = vote_utils.getEndDateString(
    pollStruct[1].toNumber()
  )

  const json = {
    salt: salt.toString(10),
    voteOption,
    pollID,
    listing: action.payload.listing,
    commitEndDateString,
    revealEndDateString,
    secretHash,
  }

  console.log('commit vote json', json)

  const listingUnderscored = action.payload.listing.replace('.', '_')
  const filename = `pollID-${pollID}_listing-${listingUnderscored}_commitVote_commitEndDate-${commitEndDateString}.json`

  // truffle-contract version
  const receipt = yield call(
    voting.contract.commitVote,
    pollID,
    secretHash,
    numTokens.toString(10),
    prevPollID
  )
  console.log('receipt', receipt)

  if (receipt.receipt.status !== '0x0') {
    saveFile(json, filename)
  }
  // ethjs version
  // Saves JSON commitVote file before sending transaction
  // yield call(saveFile, json, filename)
  // const txHash = yield call(sendTransactionSaga, txData, voting.address)
  // console.log('txHash', txHash)
}


export function* revealVoteSaga(action) {
  const voting = yield select(selectVoting)
  const finalArgs = action.payload.args
  const txData = EthAbi.encodeMethod(action.payload.method, finalArgs)

  const to = voting.address
  yield call(sendTransactionSaga, txData, to)
}