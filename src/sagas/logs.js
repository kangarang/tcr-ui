import { select, takeLatest, all, call, put } from 'redux-saga/effects'
import _ from 'lodash'

import { SET_CONTRACTS } from 'actions/constants'
import { updateListings, convertLogToListing } from 'libs/listings'

import { setListings } from '../actions'
import { selectProvider, selectRegistry, selectVoting } from '../selectors'

export default function* logsSaga() {
  yield takeLatest(SET_CONTRACTS, setupEventsSaga)
}

let lastReadBlockNumber = 0

function* setupEventsSaga() {
  const registry = yield select(selectRegistry)
  const voting = yield select(selectVoting)
  console.log('voting', voting)

  const {
    _Application,
    _Challenge,
    _NewListingWhitelisted,
    _ApplicationRemoved,
    _ListingRemoved,
  } = registry.interface.events

  const AllRegistryEvents = [
    _Application,
    _Challenge,
    _NewListingWhitelisted,
    _ApplicationRemoved,
    _ListingRemoved,
  ]

  yield call(getHistorySaga, AllRegistryEvents, registry.address)

  // const { PollCreated, VoteCommitted, VoteRevealed } = voting.interface.events
  // const AllVotingEvents = [PollCreated, VoteCommitted, VoteRevealed]

  // yield call(getHistorySaga, AllVotingEvents, voting.address)
}

function* getHistorySaga(AllEvents, contractAddress) {
  const provider = yield select(selectProvider)
  const registry = yield select(selectRegistry)
  const voting = yield select(selectVoting)
  const freshListings = yield all(
    AllEvents.map(ContractEvent => {
      return decodeLogs(
        provider,
        registry,
        ContractEvent,
        voting,
        contractAddress
      )
    })
  )
  const flattened = _.flatten(freshListings)
  console.log('flattened', flattened)
  const updatedListings = yield call(updateListings, [], flattened)
  console.log('updatedListings', updatedListings.toJS())
  yield put(setListings(updatedListings))
}

async function decodeLogs(
  provider,
  registry,
  ContractEvent,
  voting,
  contractAddress
) {
  const logs = await provider.getLogs({
    fromBlock: lastReadBlockNumber,
    toBlock: 'latest',
    address: contractAddress,
    topics: ContractEvent.topics,
  })
  const event = ContractEvent.name
  console.log(event, logs)

  let listings = []
  for (const log of logs) {
    const logData = ContractEvent.parse(log.topics, log.data)
    const block = await provider.getBlock(log.blockHash)
    const tx = await provider.getTransaction(log.transactionHash)
    const listing = await convertLogToListing(
      logData,
      block,
      tx,
      event,
      registry,
      voting
    )
    listings.push(listing)
  }
  return listings
}
