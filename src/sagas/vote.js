import { select, call, takeEvery } from 'redux-saga/effects'
import {
  TX_REQUEST_VOTING_RIGHTS,
  TX_COMMIT_VOTE,
  TX_REVEAL_VOTE,
} from '../actions/constants'

import {
  // selectEthjs,
  selectAccount,
  selectVoting,
} from '../selectors'

import { randInt, convertedToBaseUnit } from '../utils/_units'

import _hash from '../utils/_hash'
import saveFile from '../utils/_file'
import { sendTransactionSaga } from './udapp'
import { getEndDateString } from '../utils/_datetime';

export default function* voteSaga() {
  yield takeEvery(TX_REQUEST_VOTING_RIGHTS, requestVotingRightsSaga)
  yield takeEvery(TX_COMMIT_VOTE, commitVoteSaga)
  yield takeEvery(TX_REVEAL_VOTE, revealVoteSaga)
}

export function* requestVotingRightsSaga(action) {
  try {
    const voting = yield select(selectVoting)
    const tokens = yield call(convertedToBaseUnit, action.payload.args[0], 18)
    const args = [tokens]
    yield call(sendTransactionSaga, voting, 'requestVotingRights', args)
  } catch (error) {
    console.log('request voting rights error:', error)
  }
}

export function* commitVoteSaga(action) {
  const account = yield select(selectAccount)
  const voting = yield select(selectVoting)

  console.log('commit vote saga:', action)
  const { args } = action.payload
  const pollID = args[0]
  const voteOption = args[1]
  const numTokens = args[2]
  const data = args[3]
  console.log('args', args)
  // const numTokens = convertedToBaseUnit(args[2], 18)
  const salt = randInt(1e6, 1e8)

  // format args
  const secretHash = _hash.getVoteSaltHash(voteOption, salt.toString(10))
  const prevPollID = yield call(
    voting.getInsertPointForNumTokens.call,
    account,
    numTokens
  )
  console.log('prevPollID', prevPollID)
  const finalArgs = [pollID, secretHash, numTokens, prevPollID.toString(10)]

  // grab the poll from the mapping
  const pollStruct = yield call(voting.pollMap.call, pollID)
  console.log('pollStruct', pollStruct)

  // record expiry dates
  const commitEndDateString = getEndDateString(pollStruct[0].toNumber())
  const revealEndDateString = getEndDateString(pollStruct[1].toNumber())

  const json = {
    salt: salt.toString(10),
    voteOption,
    pollID,
    data,
    commitEnd: commitEndDateString,
    revealEnd: revealEndDateString,
    secretHash,
    numTokens,
  }

  console.log('commit json:', json)

  const listingUnderscored = data.replace('.', '_')
  const filename = `${listingUnderscored}_pollID-${pollID}.json`

  // saveFile(json, filename)

  const receipt = yield call(
    sendTransactionSaga,
    voting,
    'commitVote',
    finalArgs
  )

  if (receipt.receipt.status !== '0x00') {
    saveFile(json, filename)
  } else {
    console.log('ERROR')
  }
}

export function* revealVoteSaga(action) {
  const voting = yield select(selectVoting)
  const { args, methodName } = action.payload
  yield call(sendTransactionSaga, voting, methodName, args)
}
