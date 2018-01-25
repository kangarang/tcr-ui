import { call, put, fork, select, all, takeLatest } from 'redux-saga/effects'
import { CLICK_ACTION_REQUEST } from '../actions/constants'
import { getContract } from '../services'
import voteUtils from '../utils/vote_utils'

import { selectAccount, selectParameters } from '../selectors'

export default function* root() {
  yield takeLatest(CLICK_ACTION_REQUEST, clickSaga)
}

function* clickSaga(action) {
  console.log('action', action)
  try {
    const { method, pollID, listing } = action.payload

    const voting = yield call(getContract, 'voting')
    const voteOption = '0'
    const account = yield select(selectAccount)
    const numTokens = '420'

    const votingRights = yield call(
      [voting.contract, 'voteTokenBalance', 'call'],
      account
    )
    console.log('votingRights', votingRights)
    const parameters = (yield select(selectParameters)).toJS()
    console.log('parameters', parameters)
    const receipt = yield call(
      [voteUtils, method],
      voting.contract,
      pollID,
      voteOption,
      account,
      numTokens,
      listing
    )
    if (receipt.receipt.status !== '0x0') {
      console.log('receipt', receipt)
    }
  } catch (err) {
    console.log('err', err)
  }
}
