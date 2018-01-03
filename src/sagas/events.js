import { eventChannel, END } from 'redux-saga'
import { call, put, fork, take, select, cancelled } from 'redux-saga/effects'

import {
  contractError,
  eventFromRegistry,
  getTokensAllowed,
} from '../actions'
import { selectEthjs, selectRegistry } from '../selectors'

import {
  eventUtils,
  commonUtils,
} from './utils'

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
      yield fork(handleEvent, channelEvent)
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


function* handleEvent(result) {
  const eth = yield select(selectEthjs)
  const registry = yield select(selectRegistry)

  const txDetails = yield call(commonUtils.getTransaction, eth, result.transactionHash)


  let status
  if (result.event === '_Challenge') {
    status = 'voteable'
  } else if (result.event === '_Application') {
    status = 'challengeable'
  } else {
    status = 'poop'
  }

  // This is faster than registry.isWhitelisted
  const isWhitelisted = yield call(eventUtils.checkForWhitelist, result)

  if (!isWhitelisted) {
    const canBeWhitelisted = yield call(commonUtils.canBeWhitelisted, registry, result.args.domain)
    if (canBeWhitelisted) {
      status = 'whitelistable'
    } else {
      status = false
    }
  }

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
    domain: result.args.domain,
    unstakedDeposit: result.args.deposit ? result.args.deposit : '?',
    pollID: result.args.pollID && result.args.pollID,
    index: result.logIndex,
    eventName: result.event,
    contractAddress: result.address,
    isWhitelisted,
    status,
  }

  const golem = yield call(commonUtils.shapeShift, block, tx, details)
  yield put(eventFromRegistry(golem))

  // Updates the token-registry allowance
  yield put(getTokensAllowed())
}
