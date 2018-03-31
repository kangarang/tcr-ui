import { eventChannel } from 'redux-saga'
import { call, put, select, takeLatest, cancelled, takeEvery } from 'redux-saga/effects'

import { setListings } from '../actions'
import { selectRegistry, selectAllListings, selectProvider, selectVoting } from '../selectors'
import { getBlockAndTxnFromLog, decodeLog } from 'sagas/logs'
import { updateListings, findGolem, changeGolem } from 'libs/listings'
import { SET_REGISTRY_CONTRACT } from '../actions/constants'
import { fromJS } from 'immutable'

export default function* eventsSaga() {
  yield takeLatest(SET_REGISTRY_CONTRACT, setupEventChannels)
}

function* setupEventChannels() {
  const provider = yield select(selectProvider)
  const registry = yield select(selectRegistry)

  // grab registry events
  const {
    _Application,
    _Challenge,
    _ApplicationWhitelisted,
    _ApplicationRemoved,
    _ChallengeSucceeded,
    _ListingRemoved,
    // _ListingWithdrawn,
  } = registry.interface.events

  // extract the topics
  const aTopics = _Application.topics
  const cTopics = _Challenge.topics
  const wlTopics = _ApplicationWhitelisted.topics
  const arTopics = _ApplicationRemoved.topics
  const csTopics = _ChallengeSucceeded.topics
  const lrTopics = _ListingRemoved.topics

  // create channels for each event-topic
  const aChannel = yield call(createChannel, provider, aTopics, _Application)
  const cChannel = yield call(createChannel, provider, cTopics, _Challenge)
  const wlChannel = yield call(createChannel, provider, wlTopics, _ApplicationWhitelisted)
  const arChannel = yield call(createChannel, provider, arTopics, _ApplicationRemoved)
  const csChannel = yield call(createChannel, provider, csTopics, _ChallengeSucceeded)
  const lrChannel = yield call(createChannel, provider, lrTopics, _ListingRemoved)

  // // grab voting events
  // const { VoteCommitted, VoteRevealed } = voting.interface.events

  // // extract the topics
  // const vcTopics = VoteCommitted.topics
  // const vrTopics = VoteRevealed.topics

  // // create channels for each event-topic
  // const vcChannel = yield call(createChannel, provider, vcTopics, VoteCommitted)
  // const vrChannel = yield call(createChannel, provider, vrTopics, VoteRevealed)

  try {
    while (true) {
      yield takeEvery(aChannel, handleEventEmission)
      yield takeEvery(cChannel, handleEventEmission)
      yield takeEvery(wlChannel, handleEventEmission)
      yield takeEvery(arChannel, handleEventEmission)
      yield takeEvery(csChannel, handleEventEmission)
      yield takeEvery(lrChannel, handleEventEmission)
      // yield takeEvery(vcChannel, handleEventEmission)
      // yield takeEvery(vrChannel, handleEventEmission)
    }
  } finally {
    if (yield cancelled()) {
      console.log('LISTENING CANCELLED')
      aChannel.close()
      cChannel.close()
      wlChannel.close()
      arChannel.close()
      csChannel.close()
      lrChannel.close()
    }
  }
}

// eventChannel is a factory function that creates a Channel
// for events from sources other than the Redux store
const createChannel = (provider, eventTopics, ContractEvent) =>
  eventChannel(emitter => {
    provider.removeAllListeners(eventTopics)
    const event = provider.on(eventTopics, function(log) {
      console.log(ContractEvent.name, log)
      emitter({ ContractEvent, log })
    })
    return () => event.stopWatching()
  })

function* handleEventEmission({ ContractEvent, log }) {
  console.log('emit!')
  console.log(ContractEvent.name, log)
  const provider = yield select(selectProvider)
  const listings = yield select(selectAllListings)

  const { block, tx } = yield call(getBlockAndTxnFromLog, log, provider)
  const txData = {
    txHash: tx.hash,
    blockNumber: block.number,
    blockHash: block.hash,
    ts: block.timestamp,
  }
  if (log.listingHash) {
    const golem = yield call(findGolem, log.listingHash, listings)
    console.log('golem', golem)
    // const listing = yield call(changeGolem, golem, ContractEvent.name, log, tx.from)
    // console.log('listing', listing)
    // const updatedListings = listings.set(log.listingHash, fromJS(listing))
    // console.log('updatedListings', updatedListings.toJS())
    // yield put(setListings(updatedListings))
  }
}
