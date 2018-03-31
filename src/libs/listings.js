import { fromJS } from 'immutable'
import { convertUnix } from 'utils/_datetime'
import { getIPFSData } from './ipfs'

export async function convertLogToGolem(log, blockTxn, owner) {
  let { listingHash, deposit, appEndDate, data } = log

  // application expiration details
  const appExpiry = convertUnix(appEndDate.toNumber())

  // ipfs api
  const ipfsContent = await getIPFSData(data)
  const ipfsID = ipfsContent.id
  const ipfsData = ipfsContent.data
    ? ipfsContent.data
    : ipfsContent.registry && ipfsContent.registry

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
    pollID: false,
    ipfsHash: data,
    // view-data
    status: '1',
    ipfsID,                   // ipfs -> content -> id (usually the)
    ipfsData,                 // ipfs -> content -> data
    unstakedDeposit: deposit, // numTokens potentially at-risk for Applicant
    appExpiry,                // datetime
    commitExpiry: false,      // datetime
    revealExpiry: false,      // datetime
  }
  return golem
}

export function findGolem(listingHash, listings) {
  return listings.get(listingHash)
}

export function changeGolem(golem, eventName, log, txData, msgSender) {
  let {
    // Registry
    listingHash,
    challengeID,
    data,
    // Voting
    pollID,
    numTokens,
    votesFor,
    votesAgainst,
    commitEndDate,
    revealEndDate,
    rewardPool,
    totalTokens,
  } = log
  let { ts, blockNumber } = txData

  console.log(eventName, golem.get('ipfsID'))
  console.log('golem', golem.toJS())
  console.log('log', log)

  // TODO: before this function,
  // make sure it's a newer transaction
  // i.e. sort by timestamp
  if (ts < golem.get('ts')) {
    console.log('old txn; returning listing')
    return golem
  }

  switch (eventName) {
    case '_Application':
      return golem
        .set('status', '1')
        .set('challenger', false)
        .set('challengeID', false)
        .set('challengeData', false)
    case '_Challenge':
      return golem
        .set('status', '2')
        .set('challenger', msgSender)
        .set('challengeID', challengeID)
        .set('challengeData', data)
    // voting
    case '_PollCreated':
      return golem
        .set('status', '2')
        .set('pollID', pollID)
        .set('commitEndDate', commitEndDate)
        .set('revealEndDate', revealEndDate)
    case '_VoteCommitted':
      return golem
        .set('status', '2')
        .set('votesFor', votesFor)
        .set('votesAgainst', votesAgainst)
    case '_VoteRevealed':
      return golem
        .set('status', '2')
        .set('votesFor', votesFor)
        .set('votesAgainst', votesAgainst)
    // whitelist
    case '_ApplicationWhitelisted':
      return golem
        .set('status', '3')
        .set('challenger', false)
        .set('challengeID', false)
    case '_ChallengeFailed':
      return golem
        .set('status', '3')
        .set('rewardPool', votesFor)
        .set('totalTokens', totalTokens)
        .set('challengeID', false)
        .set('challengeData', false)
    // delete
    case '_ChallengeSucceeded':
      return golem
        .set('status', '0')
        .set('rewardPool', votesFor)
        .set('totalTokens', totalTokens)
        .set('challengeID', false)
        .set('challengeData', false)
    case '_ListingRemoved':
      return golem
        .set('status', '0')
        .set('rewardPool', '0')
        .set('totalTokens', '0')
    case '_ListingWithdrawn':
      return golem
        .set('status', '0')
        .set('rewardPool', '0')
        .set('totalTokens', '0')
    case '_TouchAndRemoved':
      return golem
        .set('status', '0')
        .set('rewardPool', '0')
        .set('totalTokens', '0')
    // token
    case '_RewardClaimed':
      return golem
    default:
      return golem
  }
}

// There can only be 1 golem per listingHash (i.e. Application)
// in the listings Map, set the golem:
// key:   golem.listingHash
// value: golem
export function setApplications(applications, newApplications) {
  return fromJS(newApplications).reduce((acc, val) => {
    return acc.set(val.get('listingHash'), fromJS(val))
  }, fromJS(applications))
  // Array.reduce(reducer, initialAcc)
  // reducer: (acc, val) => acc
  // initialAcc: applications
}

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
  return fromJS(unsorted).sort((a, b) => {
    if (a.getIn(['txData', 'ts']) < b.getIn(['txData', 'ts'])) {
      return -1
    } else if (a.getIn(['txData', 'ts']) > b.getIn(['txData', 'ts'])) {
      return 1
    }
    return 0
  })
}
