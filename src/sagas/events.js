import { eventChannel } from 'redux-saga'
import { fromJS } from 'immutable'
import { call, put, select, takeLatest, cancelled, takeEvery } from 'redux-saga/effects'

import { setListings, updateListing } from '../actions'
import { selectRegistry, selectAllListings, selectProvider, selectVoting } from '../selectors'
import { getBlockAndTxnFromLog, decodeLog } from 'sagas/logs'
import { findGolem, changeListing, findChallenge } from 'libs/listings'
import { SET_CONTRACTS } from '../actions/constants'
import { convertLogToListing, setApplications } from '../libs/listings'

export default function* rootEventsSaga() {
  yield takeLatest(SET_CONTRACTS, setupEventChannels)
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
    _ListingRemoved,
    _ListingWithdrawn,
    _TouchAndRemoved,
    // _ChallengeFailed,
    // _ChallengeSucceeded,
  } = registry.interface.events

  // create channels for each event-topic
  const aChannel = yield call(createChannel, provider, _Application)
  const cChannel = yield call(createChannel, provider, _Challenge)
  const awChannel = yield call(createChannel, provider, _ApplicationWhitelisted)
  const arChannel = yield call(createChannel, provider, _ApplicationRemoved)
  const lrChannel = yield call(createChannel, provider, _ListingRemoved)
  const lwChannel = yield call(createChannel, provider, _ListingWithdrawn)
  const trChannel = yield call(createChannel, provider, _TouchAndRemoved)

  try {
    while (true) {
      yield takeEvery(aChannel, handleEventEmission)
      yield takeEvery(cChannel, handleEventEmission)
      yield takeEvery(awChannel, handleEventEmission)
      yield takeEvery(arChannel, handleEventEmission)
      yield takeEvery(lrChannel, handleEventEmission)
      yield takeEvery(lwChannel, handleEventEmission)
      yield takeEvery(trChannel, handleEventEmission)
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
    }
  }
}

// eventChannel is a factory function that creates a Channel
// for events from sources other than the Redux store
const createChannel = (provider, ContractEvent) =>
  eventChannel(emitter => {
    // provider.removeAllListeners(ContractEvent.topics)
    provider.on(ContractEvent.topics, function(log) {
      emitter({ ContractEvent, log })
    })
    return () => provider.removeAllListeners(ContractEvent.topics)
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
  const dLog = yield call(decodeLog, ContractEvent, log)
  console.log('dLog', dLog)

  if (ContractEvent.name === '_Application') {
    const listing = yield call(convertLogToListing, dLog, txData, tx.from)
    yield put(updateListing(listing))
  } else if (dLog.listingHash) {
    const golem = yield call(findGolem, dLog.listingHash, listings)
    if (golem !== undefined) {
      const listing = yield call(changeListing, golem, dLog, txData, ContractEvent.name, tx.from)
      console.log('listing', listing.toJS())
      const updatedListings = yield call(setApplications, listings, [listing])
      yield put(setListings(updatedListings))
    }
  } else if (dLog.pollID) {
    const golem = yield call(findChallenge, dLog.pollID, listings)
    console.log('golem', golem)
  }
}

// export function* eventsSaga() {
//   try {
//     const provider = yield select(selectProvider)
//     const registry = yield select(selectRegistry)
//     const voting = yield select(selectVoting)

//     const channel = yield call(createEventChannel, registry, voting)
//     try {
//       while (true) {
//         yield takeEvery(channel, handleEventEmission)
//       }
//     } finally {
//       if (yield cancelled()) {
//         console.log('LISTENING CANCELLED')
//         channel.close()
//       }
//     }
//   } catch (error) {
//     console.log('eventsSaga error:', error)
//   }
// }

// function createEventChannel(registry, voting) {
//   return eventChannel(emitter => {
//     registry.on_application = (listingHash, deposit, appEndDate, data) => {
//       emitter({ listingHash, deposit: deposit.toString(), appEndDate: appEndDate.toNumber(), data })
//     }
//     registry.on_challenge = (listingHash, challengeID, data) => {
//       emitter({ listingHash, challengeID: challengeID.toString(), data })
//     }
//     registry.on_applicationwhitelisted = listingHash => {
//       emitter({ listingHash })
//     }
//     registry.on_applicationremoved = listingHash => {
//       emitter({ listingHash })
//     }
//     registry.on_listingremoved = listingHash => {
//       emitter({ listingHash })
//     }
//     registry.on_challengesucceeded = challengeID => {
//       console.log('challenge succeeded', challengeID.toString())
//     }
//     registry.on_challengefailed = challengeID => {
//       console.log('challenge failed', challengeID.toString())
//     }
//     voting.on_pollcreated = (voteQuorum, commitEndDate, revealEndDate, pollID) => {
//       console.log(
//         'poll created',
//         commitEndDate.toString(),
//         revealEndDate.toString(),
//         pollID.toString()
//       )
//     }
//     voting.on_votecommitted = (pollID, numTokens) => {
//       console.log('vote committed', pollID.toString(), numTokens.toString())
//     }
//     voting.on_voterevealed = (pollID, numTokens, votesFor, votesAgainst) => {
//       console.log(
//         'vote revealed',
//         pollID.toString(),
//         numTokens.toString(),
//         votesFor.toString(),
//         votesAgainst.toString()
//       )
//     }
//     return () => registry.stopWatching()
//   })
// }

// // Event emitter
// function* handleEventEmission(result) {
//   try {
//     console.log('emit!')
//     console.log('result', result)
//     // const golem = findGolem(listingHash, allListings)
//     // console.log('golem', golem)
//     // const listing = golem.set('status', '2')
//     // console.log('listing', listing)
//     // yield put(updateListing(listing))
//   } catch (error) {
//     console.log('handleEventEmission error:', error)
//   }
// }
