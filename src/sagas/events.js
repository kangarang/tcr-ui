// NOTE: putting a hold on event listening for now
// Focusing on logs / polling


import { eventChannel, END } from 'redux-saga'
import { call, all, put, fork, take, select, takeLatest, cancelled } from 'redux-saga/effects'

import {
  contractError,
  getTokensAllowed,
  updateItem,
  newItem,
} from '../actions'
import { SET_CONTRACTS } from "../actions/constants";
import { selectEthjs, selectRegistry, makeSelectContract } from '../selectors'

import {
  eventUtils,
  commonUtils,
} from './utils'
import { fromNaturalUnit } from '../libs/units';

export default function* eventsSaga() {
  yield takeLatest(SET_CONTRACTS, setupEventChannels)
}

function* setupEventChannels() {
  try {
    const registry = yield select(selectRegistry)
    const voting = yield select(makeSelectContract('voting'))
    yield all([
      call(handleContractChannel, registry.contract),
      call(handleContractChannel, voting.contract),
    ])
  } catch (err) {
    console.log('err', err)
    yield put(contractError(err))
  }
}

function* handleContractChannel(contract) {
  const channel = yield call(createChannel, contract)
  try {
    while (true) {
      const channelEvent = yield take(channel)
      yield fork(handleEvent, channelEvent)
    }
  } finally {
    if (yield cancelled()) {
      console.log('LISTENING CANCELLED')
      channel.close()
    }
  }
}

// eventChannel is a factory function that creates a Channel
// for events from sources other than the Redux store
const createChannel = (contract) =>
  eventChannel((emitter) => {
    // TODO: specify _Event
    const events = contract.allEvents().watch((err, result) => {
      if (err) {
        console.log('EMIT ERROR:', err)
        emitter(END)
      } else {
        console.log('EMIT:', result.event, result)
        emitter(result)
      }
    })
    return () => events.stopWatching()
  })


function* handleEvent(result) {
  const eth = yield select(selectEthjs)
  const registry = yield select(selectRegistry)
  if (result.event === 'PollCreated' || result.event === 'VotingRightsGranted' || result.event === 'VoteCommitted') {
    return
  }

  const txDetails = yield call(commonUtils.getTransaction, eth, result.transactionHash)

  // This is faster than registry.isWhitelisted
  const isWhitelisted = yield call(eventUtils.checkForWhitelist, result)
  const canBeWhitelisted = yield call(commonUtils.canBeWhitelisted, registry, result.args.listing)

  if (result.event === '_Challenge' || result.event === '_NewListingWhitelisted') {
    // Send the event with the listing and pollID
    // Reducer takes care of the rest
    yield put(updateItem(result))
  } else if (result.event === '_Application') {
    const block = {
      number: result.blockNumber,
      hash: result.blockHash,
    }
    const tx = {
      hash: txDetails.hash,
      index: txDetails.transactionIndex,
      to: txDetails.to,
      from: txDetails.from
    }
    const details = {
      listing: result.args.listing,
      unstakedDeposit: result.args.deposit ? fromNaturalUnit(result.args.deposit).toString(10) : '?',
      pollID: result.args.pollID && result.args.pollID,
      index: result.logIndex,
      eventName: result.event,
      contractAddress: result.address,
      isWhitelisted,
      canBeWhitelisted,
    }

    const item = yield call(commonUtils.shapeShift, block, tx, details)
    yield put(newItem(item))
  }

  // Updates the token-registry allowance
  yield put(getTokensAllowed())
}
