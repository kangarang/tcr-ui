import { put, select, takeLatest } from 'redux-saga/effects'
import { CLICK_ACTION_REQUEST } from '../actions/constants'

import { selectCustomMethods } from '../actions'
import { selectParameters } from '../selectors'

export default function* udappSaga() {
  yield takeLatest(CLICK_ACTION_REQUEST, clickSaga)
}

function* userSelect(action) {
  console.log('user action:', action)
  try {
    const { method, listing, pollID } = action.payload

    const customMethods = ['commitVote']
    yield put(selectCustomMethods({ customMethods, method, listing, pollID }))
  } catch (err) {
    console.log('err', err)
  }
}
