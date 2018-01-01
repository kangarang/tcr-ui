import { eventChannel, END } from 'redux-saga'
import { call, put, fork, take, select, cancelled } from 'redux-saga/effects'

import {
  contractError,
  eventFromRegistry,
  getTokensAllowed,
  eventWhitelist,
  // eventVotingItem,
} from '../actions'
import { selectEthjs, selectRegistry } from '../selectors'
import { shapeShift } from './log-utils'

export function* setupEventChannels() {
  try {
    const registry = yield select(selectRegistry)
    yield call(handleRegistryChannel, registry.contract)
  } catch (err) {
    console.log('err', err)
    yield put(contractError(err))
  }
}

function* handleRegistryChannel(registry) {
  const registryChannel = yield call(createRegistryChannel, registry)
  try {
    while (true) {
      const channelEvent = yield take(registryChannel)
      yield fork(dispatchEvent, channelEvent)
    }
  } finally {
    if (yield cancelled()) {
      console.log('LISTENING CANCELLED')
      registryChannel.close()
    }
  }
}

// eventChannel is a factory function that creates a Channel
// for events from sources other than the Redux store
const createRegistryChannel = (registry) =>
  eventChannel((emitter) => {
    const events = registry.allEvents().watch((err, result) => {
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

function* dispatchEvent(result) {
  const eth = yield select(selectEthjs)
  const registry = yield select(selectRegistry)

  const golem = yield call(shapeShift, eth, registry, result)
  console.log('events.js golem:', golem)

  // Dispatches the event details
  if (golem.whitelisted) {
    yield put(eventWhitelist(golem))
  } else {
    yield put(eventFromRegistry(golem))
  }
  // Updates the token-registry allowance
  yield put(getTokensAllowed())
}
