import {
  call,
  put,
  select,
  takeEvery,
} from 'redux-saga/effects'
import {
  contractError,
} from '../actions'
import {
  TX_COMMIT_VOTE,
  // TX_APPROVE,
} from '../actions/constants'
import { getContract } from '../services';
import {
  selectAccount,
} from '../selectors'
import { tokensAllowedSaga } from './token';

export default function* votingSaga() {
  // yield takeEvery(TX_APPROVE, approvalSaga)
  yield takeEvery(TX_COMMIT_VOTE, commitSaga)
}
// Commit vote
function* commitSaga(payload) {
  const account = yield select(selectAccount)
  const token = yield call(getContract, 'token')
  const voting = yield call(getContract, 'voting')

  try {
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