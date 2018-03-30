import { eventChannel } from 'redux-saga'
import { call, put, select, takeLatest, cancelled, takeEvery } from 'redux-saga/effects'

import { setListings } from '../actions'
import { SET_CONTRACTS } from 'actions/constants'
import { selectRegistry, selectAllListings, selectProvider, selectVoting } from '../selectors'
import { getBlockAndTxnFromLog, decodeLog } from 'sagas/logs'
import { updateListings, convertLogToGolem } from 'libs/listings'

export default function* eventsSaga() {
  yield takeLatest(SET_CONTRACTS, setupEventChannels)
}

function* setupEventChannels() {
  const provider = yield select(selectProvider)
  const registry = yield select(selectRegistry)
  const voting = yield select(selectVoting)

  // grab registry events
  const {
    _Application,
    _Challenge,
    _NewListingWhitelisted,
    _ApplicationRemoved,
    _ListingRemoved,
  } = registry.interface.events

  // extract the topics
  const aTopics = _Application.topics
  const cTopics = _Challenge.topics
  const nlwTopics = _NewListingWhitelisted.topics
  const arTopics = _ApplicationRemoved.topics
  const lrTopics = _ListingRemoved.topics

  // create channels for each event-topic
  // const channel = yield call(createChannel, provider, _.concat(aTopics, cTopics, nlwTopics, arTopics, lrTopics), _Application)
  const aChannel = yield call(createChannel, provider, aTopics, _Application)
  const cChannel = yield call(createChannel, provider, cTopics, _Challenge)
  const nlwChannel = yield call(createChannel, provider, nlwTopics, _NewListingWhitelisted)
  const arChannel = yield call(createChannel, provider, arTopics, _ApplicationRemoved)
  const lrChannel = yield call(createChannel, provider, lrTopics, _ListingRemoved)

  // grab voting events
  const { VoteCommitted, VoteRevealed } = voting.interface.events

  // extract the topics
  const vcTopics = VoteCommitted.topics
  const vrTopics = VoteRevealed.topics

  // create channels for each event-topic
  const vcChannel = yield call(createChannel, provider, vcTopics, VoteCommitted)
  const vrChannel = yield call(createChannel, provider, vrTopics, VoteRevealed)

  try {
    while (true) {
      // yield takeEvery(channel, handleEventEmission)
      yield takeEvery(aChannel, handleEventEmission)
      yield takeEvery(cChannel, handleEventEmission)
      yield takeEvery(nlwChannel, handleEventEmission)
      yield takeEvery(arChannel, handleEventEmission)
      yield takeEvery(lrChannel, handleEventEmission)
      yield takeEvery(vcChannel, handleEventEmission)
      yield takeEvery(vrChannel, handleEventEmission)
    }
  } finally {
    if (yield cancelled()) {
      console.log('LISTENING CANCELLED')
      // channel.close()
      aChannel.close()
      cChannel.close()
      nlwChannel.close()
      arChannel.close()
      lrChannel.close()
      vcChannel.close()
      vrChannel.close()
    }
  }
}

// eventChannel is a factory function that creates a Channel
// for events from sources other than the Redux store
const createChannel = (provider, eventTopics, ContractEvent) =>
  eventChannel(emitter => {
    // console.log(ContractEvent.name, 'topics:', eventTopics)
    provider.removeAllListeners(eventTopics)
    const event = provider.on(eventTopics, function(log) {
      console.log(ContractEvent.name)
      emitter({ ContractEvent, log })
    })
    return () => event.stopWatching()
  })

function* handleEventEmission({ ContractEvent, log }) {
  const provider = yield select(selectProvider)
  const registry = yield select(selectRegistry)
  const voting = yield select(selectVoting)
  const listings = yield select(selectAllListings)

  const logData = yield call(decodeLog, ContractEvent, log)
  const { block, tx } = yield call(getBlockAndTxnFromLog, log, provider)

  const listing = yield call(
    convertLogToGolem,
    logData,
    block,
    tx,
    ContractEvent.name,
    registry,
    voting
  )
  console.log('listing', listing)
  const updatedListings = yield call(updateListings, listings, [listing])
  console.log('updatedListings', updatedListings.toJS())

  yield put(setListings(updatedListings))
}
