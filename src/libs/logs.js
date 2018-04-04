import _ from 'lodash'
import {
  convertLogToListing,
  sortByNestedBlockTimestamp,
  findGolem,
  changeListing,
  findChallenge,
} from 'libs/listings'

let lastReadBlockNumber = 0

export function flattenAndSortByNestedBlockTimestamp(events) {
  const flattened = _.flatten(events)
  return sortByNestedBlockTimestamp(flattened)
}

export async function decodeLogs(provider, ContractEvent, address) {
  // build filter
  const filter = {
    fromBlock: lastReadBlockNumber,
    toBlock: 'latest',
    address,
    topics: ContractEvent.topics,
  }
  // get logs according to filter
  const logs = await provider.getLogs(filter)
  let decodedLogs = []
  for (const log of logs) {
    const dLog = await decodeLog(ContractEvent, log, provider)
    decodedLogs.push(dLog)
  }
  // console.log('1 decodedLogs', decodedLogs)
  return decodedLogs
}

export async function decodeLog(ContractEvent, log, provider) {
  const logData = await ContractEvent.parse(log.topics, log.data)
  const { block, tx } = await getBlockAndTxnFromLog(log, provider)
  const txData = {
    txHash: tx.hash,
    blockHash: block.hash,
    ts: block.timestamp,
  }
  return {
    logData,
    txData,
    eventName: ContractEvent.name,
    msgSender: tx.from,
  }
}

export async function getBlockAndTxnFromLog(log, provider) {
  const block = await provider.getBlock(log.blockHash)
  const tx = await provider.getTransaction(log.transactionHash)
  return { block, tx }
}

// Inputs: decodedLogs: Array, currentListings: Object
// Output: updatedListings: Object
export async function convertDecodedLogs(dLogs, listings) {
  for (const log of dLogs) {
    const { logData, txData, msgSender, eventName } = log
    let golem
    let listing
    // if the log is an application,
    // transform into a new listing object
    // if not, find the corresponding listing
    // using the logData
    if (eventName === '_Application') {
      listing = await convertLogToListing(logData, txData, msgSender)
      listings[listing.listingHash] = listing
    } else if (logData.listingHash) {
      // if listingHash exists, find the corresponding listing
      golem = findGolem(logData.listingHash, listings)
    } else if (logData.pollID) {
      // if pollID or challengeID exists, find the corresponding challenge
      console.log('poll id logData', logData)
      golem = findChallenge(logData.pollID, listings)
    } else if (logData.challengeID) {
      console.log('challenge id logData', logData)
      golem = findChallenge(logData.challengeID, listings)
    }
    // invoke the changeListing function to modify the listing
    if (golem !== undefined) {
      listing = changeListing(golem, logData, txData, eventName, msgSender)
    }
    // console.log('golem, listing', golem, listing)

    // set the in the master object
    if (listing !== undefined) {
      listings[listing.listingHash] = listing
    }
  }
  console.log('listings', listings)
  // return a new object of relevant listings
  return listings
}
