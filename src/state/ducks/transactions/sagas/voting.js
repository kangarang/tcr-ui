import { select, call, takeEvery } from 'redux-saga/effects'

import { selectAccount, selectVoting } from 'state/ducks/home/selectors'

import { convertedToBaseUnit } from 'state/libs/units'
import { getVoteSaltHash, randInt } from 'state/libs/values'
import saveFile from 'state/utils/_file'
import { getEndDateString } from 'state/utils/_datetime'

import types from '../types'
import { sendTransactionSaga } from './index'

export default function* voteSaga() {
  yield takeEvery(types.TX_REQUEST_VOTING_RIGHTS, requestVotingRightsSaga)
  yield takeEvery(types.TX_COMMIT_VOTE, commitVoteSaga)
  yield takeEvery(types.TX_REVEAL_VOTE, revealVoteSaga)
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

    const { args } = action.payload
    const pollID = args[0]
    const voteOption = args[1]
    const numTokens = yield call(convertedToBaseUnit, args[2], 18)
    const data = args[3]

    // TODO: improve
    const salt = randInt(1e6, 1e8)

    // format args
    const secretHash = getVoteSaltHash(voteOption, salt.toString(10))
    const prevPollID = yield voting.getInsertPointForNumTokens(account, numTokens, pollID)
    const finalArgs = [pollID, secretHash, numTokens, prevPollID.toString(10)]

    // grab the poll from the mapping
    const pollStruct = yield voting.pollMap(pollID)

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

    const listingDashed = data.replace(' ', '-')
    const filename = `${pollID}-${listingDashed}-${numTokens}.json`

    // TODO: local storage
    saveFile(json, filename)
    yield call(sendTransactionSaga, voting, 'commitVote', finalArgs)
  } catch (error) {
    console.log('commit vote saga error', error)
  }
}

export function* revealVoteSaga(action) {
  try {
    const voting = yield select(selectVoting)
    const { args, methodName } = action.payload
    console.log('reveal args', args)
    yield call(sendTransactionSaga, voting, methodName, args)
  } catch (error) {
    console.log('reveal vote saga error', error)
  }
}
