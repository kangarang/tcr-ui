// TODO: make udapp async saga functions

import {
  call,
  put,
  select,
  // takeEvery,
} from 'redux-saga/effects'
import {
  contractError,
} from '../actions'
import {
  // TX_COMMIT_VOTE,
} from '../actions/constants'
import { getContract } from '../services';
import {
  selectAccount,
} from '../selectors'
import { tokensAllowedSaga } from './token';

export default function* votingSaga() {
  // yield takeEvery(TX_COMMIT_VOTE, commitSaga)
}

// Commit vote
function* commitSaga(payload) {
  const account = yield select(selectAccount)
  const token = yield call(getContract, 'token')
  const voting = yield call(getContract, 'voting')

  try {
    // TODO: use udapp instead
    yield call(token.approve, voting.address, payload.amount)
    yield call(voting.requestVotingRights, payload.amount)

    const receipt = yield call(voting.commitVote, payload.pollID, account, payload.amount)
    console.log('receipt', receipt)
  } catch (err) {
    console.log('Commit vote error:', err)
    yield put(contractError(err))
  }
  yield call(tokensAllowedSaga, voting.address)
}