import { select, takeLatest, call, put } from 'redux-saga/effects'
import _ from 'lodash'

import { setListings } from 'actions'
import {
  convertLogToListing,
  sortByNestedBlockTimestamp,
  findGolem,
  changeListing,
  setApplications,
  findChallenge,
} from 'libs/listings'

import { selectProvider, selectRegistry, selectVoting } from '../selectors'
import { SET_CONTRACTS } from '../actions/constants'
import { updateBalancesRequest } from '../actions'

let lastReadBlockNumber = 0

export default function* rootLogsSaga() {
  yield takeLatest(SET_CONTRACTS, setupLogsSaga)
}

export function* setupLogsSaga() {
  try {
    const registry = yield select(selectRegistry)
    const voting = yield select(selectVoting)

    // get the contract event objects
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
    const { _PollCreated, _VoteCommitted, _VoteRevealed } = voting.interface.events

    // get all applications
    const aEvents = yield call(getHistorySaga, _Application, registry.address)
    const applications = yield call(setApplications, {}, aEvents)
    console.log('applications', applications.toJS())

    const cEvents = yield call(getHistorySaga, _Challenge, registry.address)
    const awEvents = yield call(getHistorySaga, _ApplicationWhitelisted, registry.address)
    const arEvents = yield call(getHistorySaga, _ApplicationRemoved, registry.address)
    const lrEvents = yield call(getHistorySaga, _ListingRemoved, registry.address)
    const lwEvents = yield call(getHistorySaga, _ListingWithdrawn, registry.address)
    const trEvents = yield call(getHistorySaga, _TouchAndRemoved, registry.address)
    // const cfEvents = yield call(getHistorySaga, _ChallengeFailed, registry.address)
    // const csEvents = yield call(getHistorySaga, _ChallengeSucceeded, registry.address)

    const pcEvents = yield call(getHistorySaga, _PollCreated, voting.address)
    const vcEvents = yield call(getHistorySaga, _VoteCommitted, voting.address)
    const vrEvents = yield call(getHistorySaga, _VoteRevealed, voting.address)

    const lhEvents = [cEvents, awEvents, arEvents, lrEvents, lwEvents, trEvents]
    const piEvents = [
      pcEvents,
      // vcEvents,
      // vrEvents
    ]
    const sortedEvents = yield call(flattenAndSortByNestedBlockTimestamp, lhEvents)
    console.log('sortedEvents', sortedEvents.toJS())
    const updatedApplications = yield call(updateSortedEventsSaga, sortedEvents, applications)
    console.log('updatedApplications', updatedApplications.toJS())

    const sortedPIEvents = yield call(flattenAndSortByNestedBlockTimestamp, piEvents)
    console.log('sortedPollIDEvents', sortedPIEvents.toJS())
    const updatedListings = yield call(updateSortedEventsSaga, sortedPIEvents, updatedApplications)
    console.log('updatedListings', updatedListings.toJS())

    const filteredListings = updatedListings.filter(li => li.get('status') !== '0')
    console.log('filteredListings', filteredListings.toJS())

    if (filteredListings.size > 0) {
      // DISPATCH
      yield put(setListings(filteredListings))
      yield put(updateBalancesRequest())
    }
  } catch (error) {
    console.log('setupLogsSaga error', error)
  }
}

function flattenAndSortByNestedBlockTimestamp(events) {
  const flattened = _.flatten(events)
  return sortByNestedBlockTimestamp(flattened)
}

export function* updateSortedEventsSaga(sortedEvents, listings) {
  try {
    const updated = (yield sortedEvents.map(one => {
      const log = one.get('log')
      const txData = one.get('txData')
      const eventName = one.get('eventName')
      const msgSender = one.get('msgSender')

      let golem
      if (log.pollID) {
        golem = findChallenge(log.pollID, listings)
      } else if (log.listingHash) {
        golem = findGolem(log.listingHash, listings)
      }
      if (golem !== undefined) {
        return changeListing(golem, log, txData, eventName, msgSender)
      }
      return false
    })).filter(ev => ev !== false)
    // console.log('updated', updated.toJS())
    // List(Map, Map, Map)
    const updatedListings = yield call(setApplications, listings, updated)
    return updatedListings
  } catch (error) {
    console.log('sagaSaga error:', error)
  }
}

function* getHistorySaga(ContractEvent, contractAddress) {
  const provider = yield select(selectProvider)
  // decode logs
  const decodedLogs = yield call(decodeLogs, provider, ContractEvent, contractAddress)
  // convert and return logs
  return yield call(convertDecodedLogs, decodedLogs, ContractEvent, provider)
}

async function decodeLogs(provider, ContractEvent, address) {
  // build filter
  const filter = {
    fromBlock: lastReadBlockNumber,
    toBlock: 'latest',
    address,
    topics: ContractEvent.topics,
  }
  // get logs according to filter
  return provider.getLogs(filter)
}

async function convertDecodedLogs(logs, ContractEvent, provider) {
  let listings = []
  for (const log of logs) {
    // decode logs
    const logData = await decodeLog(ContractEvent, log)
    const { block, tx } = await getBlockAndTxnFromLog(log, provider)
    const txData = {
      txHash: tx.hash,
      blockHash: block.hash,
      ts: block.timestamp,
    }
    // transform into a listing object
    if (ContractEvent.name === '_Application') {
      const listing = await convertLogToListing(logData, txData, tx.from)
      listings.push(listing)
    } else {
      // pack up an object and send back for re-analysis
      const data = {
        txData,
        log: logData,
        msgSender: tx.from,
        eventName: ContractEvent.name,
      }
      listings.push(data)
    }
  }
  console.log(ContractEvent.name, 'logs:', listings)
  return listings
}

export async function decodeLog(ContractEvent, log) {
  return ContractEvent.parse(log.topics, log.data)
}

export async function getBlockAndTxnFromLog(log, provider) {
  const block = await provider.getBlock(log.blockHash)
  const tx = await provider.getTransaction(log.transactionHash)
  return { block, tx }
}
