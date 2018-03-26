import { fromJS } from 'immutable'

import { baseToConvertedUnit } from 'utils/_units'
import { convertUnixTimeLeft, dateHasPassed } from 'utils/_datetime'

import { getIPFSData } from './ipfs'

// TODO: separate concerns. Type check
export async function convertLogToListing(logData, block, tx, event, registry, voting) {
  let { listingHash, challengeID, data, pollID, numTokens } = logData
  let whitelisted
  let ipfsContent
  let ipfsData
  let ipfsID

  if (event === '_ApplicationRemoved' || event === '_ListingRemoved') {
    whitelisted = false
    numTokens = 0
  }
  if ((!listingHash && event === 'VoteCommitted') || event === 'VoteRevealed') {
    return { latest: { sender: tx.voter, pollID, numTokens } }
  }
  let listing = await registry.listings(listingHash)
  numTokens = listing[3].toString(10) ? baseToConvertedUnit(listing[3], 18) : false
  whitelisted = listing[1]
  let aeUnix = listing[0].toNumber()
  let appExpiry = convertUnixTimeLeft(aeUnix)
  let appExpired = dateHasPassed(aeUnix)

  if (event === '_Application' && data.includes('Qm')) {
    const content = await getIPFSData(data)
    ipfsContent = content
    ipfsID = content.id
    ipfsData = content.data ? content.data : content.registry && content.registry
  }

  if (event === '_NewListingWhitelisted') {
    whitelisted = true
  }

  let commitEndDate
  let commitExpiry
  let commitExpired
  let revealEndDate
  let revealExpiry
  let revealExpired

  if (pollID || challengeID) {
    if (challengeID) {
      pollID = challengeID
    }
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
      timesince: appExpiry && appExpiry.timesince,
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

export function updateListings(listings, newListings) {
  const latestListings = fromJS(newListings).reduce((acc, val) => {
    const index = acc.findIndex(it => it.get('listingHash') === val.get('listingHash'))
    // case: new listing
    // add to list, return the list
    if (index === -1) {
      return acc.push(val)
    }
    // case: existing listing
    // if the timestamp is the more recent,
    // update the listing's `latest` object,
    // return the list
    if (val.getIn(['latest', 'ts']) > acc.getIn([index, 'latest', 'ts'])) {
      return acc.setIn([index, 'latest'], fromJS(val.get('latest')))
    }
    // case: not unique, not more recent
    // return the list
    return acc
  }, fromJS(listings)) // initial value & the shape we want the final output of Array.reduce to look like

  return latestListings
}
