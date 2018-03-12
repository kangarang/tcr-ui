import { select, takeLatest, all, call, put } from 'redux-saga/effects'

import { fromJS } from 'immutable'
import _ from 'lodash'

import { SET_CONTRACTS } from 'actions/constants'

import { baseToConvertedUnit } from 'utils/_units'
import { convertUnixTimeLeft, dateHasPassed } from 'utils/_datetime'
import { getIPFSData } from 'libs/ipfs'

import { setListings } from '../actions'

import { selectProvider, selectRegistry, selectVoting } from '../selectors'

export default function* logsSaga() {
  yield takeLatest(SET_CONTRACTS, getFreshLogs)
}

let lastReadBlockNumber = 0

function* getFreshLogs() {
  const registry = yield select(selectRegistry)
  const voting = yield select(selectVoting)
  const provider = yield select(selectProvider)

  const {
    _Application,
    _Challenge,
    _NewListingWhitelisted,
    _ApplicationRemoved,
    _ListingRemoved,
  } = registry.interface.events

  const AllEvents = [
    _Application,
    _Challenge,
    _NewListingWhitelisted,
    _ApplicationRemoved,
    _ListingRemoved,
  ]

  const freshListings = yield all(
    AllEvents.map(ContractEvent => {
      return convertLogsToListings(provider, registry, ContractEvent, voting)
    })
  )
  const flattened = _.flatten(freshListings)
  console.log('flattened', flattened)
  const updatedListings = yield call(updateListings, [], flattened)
  console.log('updatedListings', updatedListings.toJS())
  yield put(setListings(updatedListings))
}

function updateListings(listings, newListings) {
  const latestListings = fromJS(newListings).reduce((acc, val) => {
    const index = acc.findIndex(
      it => it.get('listingHash') === val.get('listingHash')
    )
    // New listing
    if (index === -1) {
      return acc.push(val)
    }
    // Check to see if the event is the more recent
    if (val.getIn(['latest', 'ts']) > acc.getIn([index, 'latest', 'ts'])) {
      return acc.setIn([index, 'latest'], fromJS(val.get('latest')))
    }
    // Not unique, not more recent, return List
    return acc
  }, fromJS(listings))

  return latestListings
}

async function convertLogsToListings(
  provider,
  registry,
  ContractEvent,
  voting
) {
  const logs = await provider.getLogs({
    fromBlock: lastReadBlockNumber,
    toBlock: 'latest',
    address: registry.address,
    topics: ContractEvent.topics,
  })
  const event = ContractEvent.name
  console.log(event, logs)

  let listings = []
  for (const log of logs) {
    const logData = ContractEvent.parse(log.topics, log.data)
    const block = await provider.getBlock(log.blockHash)
    const tx = await provider.getTransaction(log.transactionHash)

    // console.log('logData, block, txDetails', logData, block, tx)

    let { listingHash, challengeID, data } = logData
    let numTokens
    let whitelisted
    let ipfsContent
    let ipfsData
    let ipfsID

    if (event === '_ApplicationRemoved' || event === '_ListingRemoved') {
      whitelisted = false
      numTokens = 0
    }

    // TODO: see if you can check the status before getting ipfs data
    if (event === '_Application') {
      const content = await getIPFSData(data)
      // console.log('ipfs content retrieved:', content)
      ipfsContent = content
      ipfsID = content.id // string
      ipfsData = content.data
        ? content.data
        : content.registry && content.registry // listings
    }

    let listing = await registry.listings(listingHash)
    numTokens = listing[3].toString(10)
      ? baseToConvertedUnit(listing[3], 18)
      : false

    if (listing) {
      whitelisted = listing[1]
    }

    let commitEndDate
    let commitExpiry
    let revealEndDate
    let revealExpiry

    let aeUnix = listing[0].toNumber()
    const appExpiry = convertUnixTimeLeft(aeUnix)
    const appExpired = dateHasPassed(aeUnix)

    let pollID = logData.pollID || challengeID

    if (pollID) {
      pollID = pollID.toString()
      const poll = await voting.pollMap(pollID)
      commitEndDate = poll[0].toNumber()
      commitExpiry = convertUnixTimeLeft(commitEndDate)
      revealEndDate = poll[1].toNumber()
      revealExpiry = convertUnixTimeLeft(revealEndDate)
    }
    let appInfo = {
      listingHash,
      data,
      appExpiry,
      whitelisted,
    }
    if (event === '_Application') {
      appInfo = {
        ...appInfo,
        owner: event === '_Application' && tx.from,
        ipfsContent,
        ipfsData,
        ipfsID,
      }
    }
    const li = {
      ...appInfo,
      latest: {
        appExpired,
        txHash: tx.hash,
        blockHash: block.hash,
        blockNumber: block.number,
        ts: block.timestamp,
        sender: tx.from,
        event,
        pollID,
        numTokens,
        commitEndDate,
        commitExpiry,
        revealEndDate,
        revealExpiry,
      },
    }
    listings.push(li)
  }
  return listings
}

// Get notified when a contract event is logged
// var eventTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
// provider.on([ eventTopic ], function(log) {
//     console.log('Event Log');
//     console.log(log);
// });
