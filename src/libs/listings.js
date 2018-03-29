import { fromJS } from 'immutable'
import { convertUnix } from 'utils/_datetime'
import { getIPFSData } from './ipfs'

export async function convertLogToGolem(log, block, tx) {
  let { listingHash, deposit, appEndDate, data } = log

  // application expiration details
  const appExpiry = convertUnix(appEndDate)

  // ipfs api
  const ipfsContent = await getIPFSData(data)
  const ipfsID = ipfsContent.id
  const ipfsData = ipfsContent.data
    ? ipfsContent.data
    : ipfsContent.registry && ipfsContent.registry

  // Golem: an animated anthropomorphic being that is
  // magically created entirely from inanimate matter

  // prettier-ignore
  const golem = {
    // meta-data
    listingHash,              // id
    owner: tx.from,           // actions / view
    challenger: false,        // actions / view
    pollID: false,            // actions / view
    ipfsHash: data,           // ipfs api
    txHash: tx.hash,          // transaction of apply()
    blockHash: block.hash,    // block of apply()
    ts: block.timestamp,      // block of apply()
    // view-data
    status: '1',              // application
    ipfsID,                   // ipfs -> content -> id (usually the)
    ipfsData,                 // ipfs -> content -> data
    unstakedDeposit: deposit, // numTokens potentially at-risk for Applicant
    appExpiry,                // datetime
    commitExpiry: false,      // datetime
    revealExpiry: false,      // datetime
  }
  return golem
}

// There can only be 1 golem per listingHash (i.e. Application)
// in the listings Map, set the golem:
// key:   golem.listingHash
// value: golem
export const updateApplications = (applications, newApplications) =>
  // Array.reduce(reducer, initialAcc)
  // reducer: (acc, val) => acc
  // initialAcc: applications
  fromJS(newApplications).reduce((acc, val) => {
    // TODO: check block.timestamp to make sure it doesn't overwrite a newer application
    return acc.set(val.get('listingHash'), fromJS(val))
  }, fromJS(applications))

export function updateListings(listings, newListings) {
  return fromJS(newListings).reduce((acc, val) => {
    // case: listings does not include newListings[val]
    // note: this should only happen if it's an _Application event
    // set: listings[val.listingHash] = val
    if (!acc.has(val.get('listingHash'))) {
      return acc.set(val.get('listingHash'), fromJS(val))
    }
    // case: listings includes newListings[val]
    // note: duplicate events on the same listingHash
    // set: listings.listings.events[val.events.txHash] = val.events
    return (
      acc
        .setIn([val.listingHash, 'events', val.event.blockTimestamp], fromJS(val.event))
        // assuming the list is sorted by block.timestamp
        .setIn([val.listingHash, 'status'], fromJS(val.status))
        .setIn([val.listingHash, 'latest'], fromJS(val.event))
    )
  }, fromJS(listings))
}
