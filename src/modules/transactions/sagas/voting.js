import { put, select, call } from 'redux-saga/effects'

import { selectTCR, selectAccount, selectVoting } from 'modules/home/selectors'

import { convertedToBaseUnit } from 'libs/units'
import { getVoteSaltHash } from 'libs/values'

import { getEndDateString } from 'utils/_datetime'
import { removeLocal, getLocal, saveLocal } from 'utils/_localStorage'

import { sendTransactionSaga } from './index'
import * as actions from '../actions'

export default function* voteSaga() {
  yield 'voteSaga'
}

export function* requestVotingRightsSaga(action) {
  try {
    const voting = yield select(selectVoting)
    const tcr = yield select(selectTCR)
    const tokens = yield call(
      convertedToBaseUnit,
      action.payload.args[0],
      tcr.get('tokenDecimals')
    )
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
    const tcr = yield select(selectTCR)

    const { args } = action.payload
    const pollID = args[0]
    // const voteOption = args[1]
    const voteOption = '1'
    const salt = args[2]
    const numTokens = yield call(convertedToBaseUnit, args[3], tcr.get('tokenDecimals'))
    const listing = args[4]

    // format args
    const secretHash = yield call(getVoteSaltHash, voteOption, salt.toString(10))
    const prevPollID = yield call(
      voting.getInsertPointForNumTokens,
      account,
      numTokens,
      pollID
    )
    const finalArgs = [pollID, secretHash, numTokens, prevPollID['0'].toString(10)]

    // record expiry dates
    const commitEnd = yield call(getEndDateString, listing.commitExpiry.timestamp)
    const revealEnd = yield call(getEndDateString, listing.revealExpiry.timestamp)

    const ticket = {
      secretHash,
      voteOption,
      numTokens,
      listingID: listing.listingID,
      account,
      pollID,
      salt,
      commitEnd,
      revealEnd,
      timestamp: Date.now(),
    }
    const json = {
      votingAddress: voting.address,
      account,
      ticket,
    }

    let key = `${pollID}-${listing.listingID}`
    const local = yield call(getLocal, key)

    // at this point, the user is committed to committing
    if (local && local.votingAddress === voting.address && local.account === account) {
      yield call(removeLocal, key)
      // key = `${key}(1)` // amend ticket
    }

    // TODO: handle errors

    if (!local) {
      const savedFile = yield call(saveLocal, key, json)
      console.log('savedFile:', savedFile)
    }

    yield call(sendTransactionSaga, voting, 'commitVote', finalArgs)
  } catch (error) {
    console.log('commit vote saga error', error)
    yield put(actions.sendTransactionFailed({ error }))
  }
}

export function* revealVoteSaga(action) {
  try {
    const voting = yield select(selectVoting)
    const { args, methodName } = action.payload
    yield call(sendTransactionSaga, voting, methodName, args)
  } catch (error) {
    console.log('reveal vote saga error', error)
    yield put(actions.sendTransactionFailed({ error }))
  }
}
