import { fromJS } from 'immutable'
import ipfsAPI from 'ipfs-api'

import _logs from 'utils/_logs'
import { baseToConvertedUnit } from 'utils/_units'
import { convertUnixTimeLeft, dateHasPassed } from 'utils/_datetime'
import { getIPFSData } from 'libs/ipfs'

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

// TODO: tests
// TODO: add comments
export async function buildListings(
  decodedLogs,
  ethjs,
  rawLogs,
  contract,
  voting
) {
  return Promise.all(
    decodedLogs.map(async (dLog, ind) => {
      const block = await _logs.getBlock(ethjs, rawLogs[ind].blockHash)
      const txDetails = await _logs.getTransaction(
        ethjs,
        rawLogs[ind].transactionHash
      )
      return buildListing(
        contract,
        block.timestamp,
        dLog,
        ind,
        txDetails,
        voting,
        decodedLogs
      )
    })
  )
}

// TODO: tests
// TODO: convert to saga?
// TODO: add comments
async function buildListing(contract, ts, dLog, i, txn, voting, decodedLogs) {
  try {
    let { listingHash, challengeID, data } = dLog
    const event = dLog._eventName
    let numTokens
    let whitelisted
    let ipfsContent
    let ipfsData
    let ipfsID

    if (event === '_ApplicationRemoved' || event === '_ListingRemoved') {
      whitelisted = false
      numTokens = 0
    }

    if (event === '_RewardClaimed') {
      // pull from the old logs to find the listingHash
      const dListing = decodedLogs.filter(
        li => li.pollID && li.pollID.toString() === challengeID.toString()
      )[0]
      if (!dListing) {
        return false
      }
      listingHash = dListing.listingHash
      numTokens = dListing.deposit && dListing.deposit.toString()
    }

    if (event === '_Application') {
      const content = await getIPFSData(data)
      console.log('ipfs content retrieved:', content)
      ipfsContent = content
      ipfsID = content.id // string
      ipfsData = content.data
        ? content.data
        : content.registry && content.registry // listings
    }

    let listing = await contract.listings.call(listingHash)
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

    let pollID = dLog.pollID || dLog.challengeID

    if (pollID) {
      pollID = pollID.toString()
      const poll = await voting.pollMap(pollID)
      commitEndDate = poll[0].toNumber()
      commitExpiry = convertUnixTimeLeft(commitEndDate)
      revealEndDate = poll[1].toNumber()
      revealExpiry = convertUnixTimeLeft(revealEndDate)
    }
    return {
      data,
      ipfsContent,
      ipfsData,
      ipfsID,
      owner: event === '_Application' && txn.from,
      listingHash,
      whitelisted,
      appExpiry,
      appExpired,

      latest: {
        txHash: txn.hash,
        blockHash: txn.blockHash,
        blockNumber: txn.blockNumber.toNumber(10),
        numTokens,
        pollID,
        sender: txn.from,
        event,
        ts: ts.toString(10),
        commitEndDate,
        commitExpiry,
        revealEndDate,
        revealExpiry,
      },
    }
  } catch (err) {
    console.log('build listing error', err)
  }
}
