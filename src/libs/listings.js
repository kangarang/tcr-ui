import { fromJS } from 'immutable'
import _ from 'lodash'
import { timestampToExpiry } from 'utils/_datetime'
import { ipfsGetData } from './ipfs'
import { getListingHash } from '../utils/_values'

// Sort
export function sortByBlockNumber(unsorted) {
  return fromJS(unsorted).sort((a, b) => {
    if (a.get('blockNumber') < b.get('blockNumber')) {
      return -1
    } else if (a.get('blockNumber') > b.get('blockNumber')) {
      return 1
    }
    return 0
  })
}
export function sortByBlockTimestamp(unsorted) {
  return fromJS(unsorted).sort((a, b) => {
    if (a.get('ts') < b.get('ts')) {
      return -1
    } else if (a.get('ts') > b.get('ts')) {
      return 1
    }
    return 0
  })
}
export function sortByNestedBlockTimestamp(unsorted) {
  return _.sortBy(unsorted, u => u.txData.ts)
  // return fromJS(unsorted).sort((a, b) => {
  //   if (a.getIn(['txData', 'ts']) < b.getIn(['txData', 'ts'])) {
  //     return -1
  //   } else if (a.getIn(['txData', 'ts']) > b.getIn(['txData', 'ts'])) {
  //     return 1
  //   }
  //   return 0
  // })
}

// Get
export function findGolem(listingHash, listings) {
  return listings.get(listingHash)
}
export function findChallenge(pollID, listings) {
  return fromJS(listings).find((v, k) => v.get('challengeID').toString() === pollID.toString())
}

// Set Applications
export function setApplications(applications, newApplications) {
  // There can only be 1 golem per listingHash (i.e. Application)
  // in the listings Map, set the golem:
  // key:   golem.listingHash
  // value: golem
  return fromJS(newApplications).reduce((acc, val) => {
    return acc.set(val.get('listingHash'), fromJS(val))
  }, fromJS(applications))
  // Array.reduce(reducer, initialAcc)
  // reducer: (acc, val) => acc
  // initialAcc: applications
}

// Create
export async function convertLogToListing(log, blockTxn, owner) {
  let { listingHash, deposit, appEndDate, data } = log
  let listingID

  // Check if the data is a valid ipfs multihash
  if (data.length === 46 && data.includes('Qm')) {
    const ipfsContent = await ipfsGetData(data)
    if (listingHash === getListingHash(ipfsContent.id)) {
      // Validate listingHash === keccak256(ipfsContent.id)
      listingID = ipfsContent.id
    } else {
      throw new Error('valid multihash, invalid id')
    }
  } else if (listingHash === getListingHash(data)) {
    // Validate listingHash === keccak256(data)
    listingID = data
  }
  // TODO: account for neither case

  // application expiration details
  const appExpiry = timestampToExpiry(appEndDate.toNumber())

  // ------------------------------------------------
  // Golem: an animated anthropomorphic being that is
  // magically created entirely from inanimate matter
  // ------------------------------------------------

  // prettier-ignore
  const golem = {
    // meta-data
    listingHash,
    owner,
    challenger: false,
    challengeID: false,
    status: '1',
    ...blockTxn,
    data,
    // view-data
    listingID,
    unstakedDeposit: deposit.toString(), // numTokens potentially at-risk for Applicant
    appExpiry,                // datetime
    commitExpiry: false,      // datetime
    revealExpiry: false,      // datetime
  }
  return golem
}

// Update
export function changeListing(golem, log, txData, eventName, msgSender) {
  if (txData.ts < golem.get('ts')) {
    console.log('old txn; returning listing')
    return golem
  }

  switch (eventName) {
    case '_Challenge':
      return golem
        .set('status', '2')
        .set('challenger', fromJS(msgSender))
        .set('challengeID', fromJS(log.challengeID.toString()))
    case '_ApplicationWhitelisted':
      return golem
        .set('status', '3')
        .set('challenger', false)
        .set('challengeID', false)
    case '_ApplicationRemoved':
      return golem
        .set('status', '0')
        .set('challenger', false)
        .set('challengeID', false)
    case '_ListingRemoved':
      return golem
        .set('status', '0')
        .set('challenger', false)
        .set('challengeID', false)

    case '_PollCreated':
      return golem
        .set('status', '2')
        .set('pollID', fromJS(log.pollID.toString()))
        .set('commitExpiry', fromJS(timestampToExpiry(log.commitEndDate.toNumber())))
        .set('revealExpiry', fromJS(timestampToExpiry(log.revealEndDate.toNumber())))
    case '_VoteCommitted':
      return golem
        .set('status', '2')
        .set('votesFor', fromJS(log.votesFor.toString()))
        .set('votesAgainst', fromJS(log.votesAgainst.toString()))
    case '_VoteRevealed':
      return golem
        .set('status', '2')
        .set('votesFor', fromJS(log.votesFor.toString()))
        .set('votesAgainst', fromJS(log.votesAgainst.toString()))
    case '_ChallengeFailed':
      return golem
        .set('status', '3')
        .set('challenger', false)
        .set('challengeID', false)
    case '_ChallengeSucceeded':
      return golem
        .set('status', '0')
        .set('challenger', false)
        .set('challengeID', false)
    default:
      return golem
  }
}
