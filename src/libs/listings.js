import { fromJS } from 'immutable'

import { baseToConvertedUnit } from 'utils/_units'
import { convertUnixTimeLeft, dateHasPassed } from 'utils/_datetime'

import { getIPFSData } from './ipfs'

// TODO: separate concerns. Type check
export async function convertLogToListing(
  logData,
  block,
  tx,
  event,
  registry,
  voting
) {
  let { listingHash, challengeID, data, pollID, numTokens } = logData
  let whitelisted
  let ipfsContent
  let ipfsData
  let ipfsID

  if (event === '_ApplicationRemoved' || event === '_ListingRemoved') {
    whitelisted = false
    numTokens = 0
  }
  if (!listingHash && event === 'VoteCommitted') {
    return { latest: { sender: tx.voter, pollID, numTokens } }
  }

  // TODO: see if you can check the status before getting ipfs data
  // TODO: type check to make sure the data is actually an ipfs multihash
  if (event === '_Application' && data.includes('Qm')) {
    // console.log('data', data)
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
  let commitExpired
  let revealEndDate
  let revealExpiry
  let revealExpired

  let aeUnix = listing[0].toNumber()
  const appExpiry = convertUnixTimeLeft(aeUnix)
  const appExpired = dateHasPassed(aeUnix)

  if (pollID) {
    pollID = pollID.toString()
    const poll = await voting.pollMap(pollID)
    commitEndDate = poll[0].toNumber()
    commitExpiry = convertUnixTimeLeft(commitEndDate)
    commitExpired = dateHasPassed(commitEndDate)
    revealEndDate = poll[1].toNumber()
    revealExpiry = convertUnixTimeLeft(revealEndDate)
    revealExpired = dateHasPassed(revealEndDate)
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
  return {
    ...appInfo,
    latest: {
      appExpired,
      txHash: tx.hash,
      blockHash: block.hash,
      blockNumber: block.number,
      ts: block.timestamp,
      timesince: appExpiry.timesince,
      sender: tx.from,
      event,
      pollID: pollID ? pollID : challengeID ? challengeID : false,
      numTokens,
      commitExpiry,
      commitExpired,
      revealExpiry,
      revealExpired,
    },
  }
}

// Get notified when a contract event is logged
// var eventTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
// provider.on([ eventTopic ], function(log) {
//     console.log('Event Log');
//     console.log(log);
// });

export function updateListings(listings, newListings) {
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
