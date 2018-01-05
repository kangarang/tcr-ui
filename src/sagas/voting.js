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
  TX_APPROVE,
} from '../actions/constants'
import {
  selectAccount,
  makeSelectContract,
} from '../selectors'
import { tokensAllowedSaga, approvalSaga } from "./token";

export default function* votingSaga() {
  yield takeEvery(TX_APPROVE, approvalSaga)
  yield takeEvery(TX_COMMIT_VOTE, commitSaga)
}
// Commit vote
function* commitSaga(payload) {
  const token = yield select(makeSelectContract('token'))
  const voting = yield select(makeSelectContract('voting'))
  const account = yield select(selectAccount)

  try {
    yield call(token.approve, voting.address, payload.amount)
    yield call(voting.requestVotingRights, payload.amount)

    const receipt = yield call(voting.commitVote, payload.pollID, account, payload.amount)
    console.log('receipt', receipt)
  } catch (err) {
    console.log('Commit vote error:', err)
    yield put(contractError(err))
  }
  yield call(tokensAllowedSaga)
}