import { eventChannel, END } from 'redux-saga'
import { call, put, select, takeLatest, cancelled, takeEvery } from 'redux-saga/effects'

import { SET_CONTRACTS } from 'actions/home'
import { setListings } from 'actions/listings'
import { selectAllListings, selectRegistry, selectProvider, selectVoting } from 'selectors'

import types from '../types'
import { decodeLog, convertDecodedLogs } from 'libs/logs'

export default function* rootEventsSaga() {
  yield takeLatest(types.SET_CONTRACTS, setupEventChannels)
}

function* setupEventChannels() {
  try {
    const provider = yield select(selectProvider)
    const registry = yield select(selectRegistry)
    const voting = yield select(selectVoting)

    const {
      _Application,
      _Challenge,
      _ApplicationWhitelisted,
      _ApplicationRemoved,
      _ListingRemoved,
      _ListingWithdrawn,
      _TouchAndRemoved,
      _ChallengeSucceeded,
      _ChallengeFailed,
    } = registry.interface.events
    const { _VoteCommitted, _VoteRevealed, _PollCreated } = voting.interface.events

    // create channels for each event-topic
    const aChannel = yield call(createChannel, provider, _Application)
    const cChannel = yield call(createChannel, provider, _Challenge)
    const awChannel = yield call(createChannel, provider, _ApplicationWhitelisted)
    const arChannel = yield call(createChannel, provider, _ApplicationRemoved)
    const lrChannel = yield call(createChannel, provider, _ListingRemoved)
    const lwChannel = yield call(createChannel, provider, _ListingWithdrawn)
    const trChannel = yield call(createChannel, provider, _TouchAndRemoved)
    const csChannel = yield call(createChannel, provider, _ChallengeSucceeded)
    const cfChannel = yield call(createChannel, provider, _ChallengeFailed)

    const vcChannel = yield call(createChannel, provider, _VoteCommitted)
    const vrChannel = yield call(createChannel, provider, _VoteRevealed)
    const pcChannel = yield call(createChannel, provider, _PollCreated)

    try {
      while (true) {
        yield takeEvery(aChannel, handleEventEmission)
        yield takeEvery(cChannel, handleEventEmission)
        yield takeEvery(awChannel, handleEventEmission)
        yield takeEvery(arChannel, handleEventEmission)
        yield takeEvery(lrChannel, handleEventEmission)
        yield takeEvery(lwChannel, handleEventEmission)
        yield takeEvery(trChannel, handleEventEmission)
        yield takeEvery(csChannel, handleEventEmission)
        yield takeEvery(cfChannel, handleEventEmission)

        yield takeEvery(vcChannel, handleEventEmission)
        yield takeEvery(vrChannel, handleEventEmission)
        yield takeEvery(pcChannel, handleEventEmission)
      }
    } finally {
      if (yield cancelled()) {
        console.log('LISTENING CANCELLED')
        aChannel.close()
        cChannel.close()
        awChannel.close()
        arChannel.close()
        lrChannel.close()
        lwChannel.close()
        trChannel.close()
        csChannel.close()
        cfChannel.close()

        vcChannel.close()
        vrChannel.close()
        pcChannel.close()
      }
    }
  } catch (error) {
    console.log('setup events saga error', error)
  }
}

// eventChannel is a factory function that creates a Channel
// for events from sources other than the Redux store
function createChannel(provider, ContractEvent) {
  return eventChannel(emitter => {
    provider.removeAllListeners(ContractEvent.topics)
    provider.on(ContractEvent.topics, function(log) {
      console.log(ContractEvent.name, 'event channel', this)
      emitter({ ContractEvent, log })
    })
    return () => provider.removeListener(ContractEvent.topics, () => emitter(END))
  })
}

function* handleEventEmission({ ContractEvent, log }) {
  try {
    const provider = yield select(selectProvider)
    const allListings = yield select(selectAllListings)

    const dLog = yield call(decodeLog, ContractEvent, log, provider)
    console.log(ContractEvent.name, 'emitted:', dLog)
    const listings = yield call(convertDecodedLogs, [dLog], allListings)
    console.log('event listings', listings)

    if (Object.keys(listings).length > 0) {
      yield put(setListings({ listings: listings, byID: Object.keys(listings) }))
    }
  } catch (error) {
    console.log('handle event emission error', error)
  }
}
