import { select, takeLatest, fork, call } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import * as epTypes from 'redux/modules/home/types'

import { selectRegistry, selectVoting } from 'redux/modules/home/selectors'

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

    // TODO: wait for success
    yield call(delay, 1000)

    // registry logs
    const fullPayload = {
      ...payload,
      eventNames: [],
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
