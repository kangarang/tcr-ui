import { select, spawn, call, take, fork, takeEvery } from 'redux-saga/effects'
import {
  TXN_MINING,
  TX_REQUEST_VOTING_RIGHTS,
  TX_COMMIT_VOTE,
  TX_REVEAL_VOTE,
} from '../reducers/transaction'

import { selectAccount, selectVoting } from '../selectors'

import { convertedToBaseUnit } from '../libs/units'
import { getVoteSaltHash, randInt } from '../libs/values'
import saveFile from '../utils/_file'
import { getEndDateString } from '../utils/_datetime'

import { sendTransactionSaga } from './transaction'

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
  try {
    const account = yield select(selectAccount)
    const voting = yield select(selectVoting)

    // console.log('commit vote saga:', action)
    const { args } = action.payload
    const pollID = args[0]
    const voteOption = args[1]
    // const numTokens = args[2]
    const numTokens = yield call(convertedToBaseUnit, args[2], 18)
    const data = args[3]
    // console.log('args', args)

    // TODO: fix
    const salt = randInt(1e6, 1e8)

    // format args
    const secretHash = getVoteSaltHash(voteOption, salt.toString(10))
    const prevPollID = yield voting.getInsertPointForNumTokens(account, numTokens, pollID)
    // console.log('prevPollID', prevPollID)
    const finalArgs = [pollID, secretHash, numTokens, prevPollID.toString(10)]

    // grab the poll from the mapping
    const pollStruct = yield voting.pollMap(pollID)
    // console.log('pollStruct', pollStruct)

    // record expiry dates
    const commitEndDateString = getEndDateString(pollStruct[0].toNumber())
    const revealEndDateString = getEndDateString(pollStruct[1].toNumber())

    const json = {
      voteOption,
      numTokens,
      commitEnd: commitEndDateString,
      revealEnd: revealEndDateString,
      pollID,
      data,
      salt: salt.toString(10),
      secretHash,
      account,
    }

    // console.log('commit json:', json)

    const listingDashed = data.replace(' ', '-')
    const filename = `poll-${pollID}-${listingDashed}.json`

    yield spawn(sendTransactionSaga, voting, 'commitVote', finalArgs)

    while (true) {
      const receipt = yield take(TXN_MINING)
      saveFile(json, filename)
    }
  } catch (error) {
    console.log('commit vote saga error', error)
  }
}

export function* revealVoteSaga(action) {
  try {
    const voting = yield select(selectVoting)
    const { args, methodName } = action.payload
    yield call(sendTransactionSaga, voting, methodName, args)
  } catch (error) {
    console.log('reveal vote saga error', error)
  }
}
