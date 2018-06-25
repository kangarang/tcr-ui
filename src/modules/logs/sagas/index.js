import { select, takeLatest, take, fork, call } from 'redux-saga/effects'

import * as epTypes from 'modules/home/types'
import * as liTypes from 'modules/listings/types'

import { selectRegistry, selectVoting } from 'modules/home/selectors'

import rootPollLogsSaga, { initPolling, decodeLogsSaga } from './poll'

export default function* rootLogsSaga() {
  yield fork(rootPollLogsSaga)
  yield takeLatest(epTypes.SET_CONTRACTS, getFreshLogs)
}

function* getFreshLogs() {
  try {
    const registry = yield select(selectRegistry)
    const voting = yield select(selectVoting)
    const blockRange = {
      fromBlock: '0',
      toBlock: 'latest',
    }

    // application logs
    const payload = {
      abi: registry.abi,
      contractAddress: registry.address,
      eventNames: ['_Application'],
      blockRange,
    }
    yield call(decodeLogsSaga, { payload, applications: true })

    // wait for success
    yield take(liTypes.SET_LISTINGS)

    // registry logs
    const fullPayload = {
      ...payload,
      eventNames: [
        '_ApplicationWhitelisted',
        '_ApplicationRemoved',
        '_ListingRemoved',
        '_ListingWithdrawn',
        '_Challenge',
        '_ChallengeFailed',
        '_ChallengeSucceeded',
        '_TouchAndRemoved',
        '_RewardClaimed',
      ],
    }
    yield call(decodeLogsSaga, { payload: fullPayload })

    // voting logs
    const votingPayload = {
      abi: voting.abi,
      contractAddress: voting.address,
      eventNames: ['_VoteCommitted', '_VoteRevealed'],
      blockRange,
    }
    yield call(decodeLogsSaga, { payload: votingPayload })
  } catch (err) {
    console.log('Fresh log error:', err)
    throw new Error(err.message)
  }
  yield fork(initPolling)
}
