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

  // Dispatches the event details
  if (golem.whitelisted) {
    yield put(eventWhitelist(golem))
  } else {
    yield put(eventFromRegistry(golem))
  }
  // Updates the token-registry allowance
  yield put(getTokensAllowed())
}

const shapeShift = async (eth, registry, thing) => {
  const txDetails = await eth.getTransactionByHash(thing.transactionHash)
  console.log('txDetails', txDetails)

  let status
  if (thing.event === '_Challenge') {
    status = 'voteable'
  } else if (thing.event === '_Application') {
    status = 'challengeable'
  }

  const isWhitelisted = checkForWhitelist(thing)
  if (!isWhitelisted) {
    const canBeWhitelisted = await registry.contract.canBeWhitelisted.call(thing.args.domain)
    if (canBeWhitelisted) {
      status = 'whitelistable'
    }
  }
  console.log('thing', thing)
  console.log('status', status)
  return {
    contractAddress: thing.address,
    domain: thing.args.domain,
    unstakedDeposit: thing.args.deposit ? thing.args.deposit.toString(10) : false,
    challengeID: thing.args.pollID ? thing.args.pollID.toString(10) : false,
    whitelisted: isWhitelisted,
    event: thing.event,
    blockNumber: thing.blockNumber.toString(10),
    blockHash: thing.blockHash,
    txHash: thing.transactionHash.toString(10),
    txIndex: thing.transactionIndex.toString(10),
    logIndex: thing.logIndex.toString(10),
    from: txDetails.from,
    to: txDetails.to,
    status,
  }
}

const checkForWhitelist = (item) => {
  switch (item.event) {
    case '_NewDomainWhitelisted' || '_ChallengeFailed':
      return true
    case '_Application' || '_Challenge' || '_ChallengeSucceeded':
      return false
    default:
      return false
  }
}
