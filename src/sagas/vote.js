import { select, call, takeEvery } from 'redux-saga/effects'
import {
  TX_REQUEST_VOTING_RIGHTS,
  TX_COMMIT_VOTE,
  TX_REVEAL_VOTE,
} from '../actions/constants'

import { selectAccount, selectVoting } from '../selectors'

import { convertedToBaseUnit } from 'utils/_units'
import { getVoteSaltHash, randInt } from 'utils/_values'
import saveFile from 'utils/_file'
import { getEndDateString } from 'utils/_datetime'

import { sendTransactionSaga } from 'sagas/transaction'

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

  // console.log('commit vote saga:', action)
  const { args } = action.payload
  const pollID = args[0]
  const voteOption = args[1]
  const numTokens = args[2]
  const data = args[3]
  // console.log('args', args)
  // const numTokens = convertedToBaseUnit(args[2], 18)

  // TODO: fix
  const salt = randInt(1e6, 1e8)

  // format args
  const secretHash = getVoteSaltHash(voteOption, salt.toString(10))
  const prevPollID = yield voting.getInsertPointForNumTokens(account, numTokens)
  // console.log('prevPollID', prevPollID)
  const finalArgs = [pollID, secretHash, numTokens, prevPollID.toString(10)]

  // grab the poll from the mapping
  const pollStruct = yield voting.pollMap(pollID)
  // console.log('pollStruct', pollStruct)

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

  // console.log('commit json:', json)

  const listingUnderscored = data.replace('.', '_')
  const filename = `${listingUnderscored}_pollID-${pollID}.json`

  saveFile(json, filename)

  yield call(sendTransactionSaga, voting, 'commitVote', finalArgs)

  saveFile(json, filename)
}

export function* revealVoteSaga(action) {
  const voting = yield select(selectVoting)
  const { args, methodName } = action.payload
  yield call(sendTransactionSaga, voting, methodName, args)
}
