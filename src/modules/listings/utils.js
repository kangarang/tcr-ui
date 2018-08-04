import { fromJS } from 'immutable'
import find from 'lodash/fp/find'

import tokenList from 'config/tokens/eth.json'

import { getListingHash, isAddress } from 'libs/values'
import { BN } from 'libs/units'
import { ipfsCheckMultihash, ipfsGetData } from 'libs/ipfs'
import { timestampToExpiry } from 'utils/_datetime'
// import { saveLocal } from 'utils/_localStorage'

// Finds the corresponding listing according the eventName
export function findListing(logData, listings) {
  switch (logData._eventName) {
    case '_Application':
    case '_Challenge':
    case '_ApplicationWhitelisted':
    case '_ApplicationRemoved':
    case '_ChallengeFailed':
    case '_ChallengeSucceeded':
    case '_ListingRemoved':
      return listings.get(logData.listingHash)
    case '_PollCreated':
    case '_VoteCommitted':
    case '_VoteRevealed':
      return listings.find((v, k) => {
        return v.get('challengeID') === logData.pollID.toString()
      })
    default:
      return false
  }
}

export async function handleMultihash(listingHash, data) {
  const ipfsContent = await ipfsGetData(data)
  // validate (listingHash === keccak256(ipfsContent.id))
  if (listingHash === getListingHash(ipfsContent.id)) {
    const listingID = ipfsContent.id
    let listingData = {}

    // validate address
    if (isAddress(listingID.toLowerCase())) {
      listingData = find(
        toke => toke.address.toLowerCase() === listingID.toLowerCase(),
        tokenList
      )

      // TODO: move to api module
      const baseUrl = `https://raw.githubusercontent.com/kangarang/token-icons/master/images/`
      if (listingData && listingData.address) {
        listingData.imgSrc = `${baseUrl}${listingData.address.toLowerCase()}.png`
      } else {
        listingData.imgSrc = ''
      }
    } else if (ipfsContent.data) {
      listingData.imgSrc = ipfsContent.data
    }
    return { listingID, listingData }
  }
  throw new Error('valid multihash, invalid id')
}

// creates a listing entity from _Application log
// I - decoded log, block/tx info, msgSender
// O - listing object
export async function createListing(log, blockTxn, owner) {
  let { listingHash, deposit, appEndDate, listingID, data, _eventName } = log
  if (_eventName !== '_Application') {
    throw new Error('not an application')
  }
  let listingData = {}

  // IPFS multihash validation
  if (ipfsCheckMultihash(data)) {
    const res = await handleMultihash(listingHash, data)
    listingID = res.listingID
    listingData = res.listingData
  } else if (data) {
    listingData.imgSrc = data
  } else {
    listingData.imgSrc = ''
  }
  // TODO: validate for neither case

  // starting structure for every listing entity
  const listing = {
    listingHash,
    owner,
    data,
    listingData,
    listingID,
    status: '1',
    unstakedDeposit: deposit.toString(10),
    appExpiry: timestampToExpiry(appEndDate.toNumber()),
    ...blockTxn,
    pollID: false,
    challenger: false,
    challengeID: false,
    challengeData: false,
    commitExpiry: {},
    revealExpiry: {},
    votesFor: '0',
    votesAgainst: '0',
    challengeReward: '0',
    userVotes: '0',
    totalVotes: '0',
    tokensToClaim: false,
    userVoteChoice: '',
  }

  // save to local storage
  // await saveLocal(listingHash, listing)
  return listing
}

// updates a listing's values
// determines where it gets rendered
export function changeListing(golem, log, txData, eventName, account) {
  if (txData.get('ts').lt(golem.get('ts'))) {
    console.log('old txn; returning listing')
    return golem
  }
  switch (eventName) {
    case '_Challenge':
      return golem
        .set('status', fromJS('2'))
        .set('challenger', fromJS(log.challenger))
        .set('challengeID', fromJS(log.challengeID.toString()))
        .set('pollID', fromJS(log.challengeID.toString()))
        .set('challengeData', fromJS(log.data.toString()))
        .set('commitExpiry', fromJS(timestampToExpiry(log.commitEndDate.toNumber())))
        .set('revealExpiry', fromJS(timestampToExpiry(log.revealEndDate.toNumber())))
    case '_ApplicationWhitelisted':
    case '_ChallengeFailed':
      if (golem.get('userVoteChoice') === '1') {
        return golem.set('tokensToClaim', fromJS(true)).set('status', fromJS('3'))
      } else {
        return golem.set('status', fromJS('3'))
      }
    case '_ApplicationRemoved':
    case '_ListingRemoved':
    case '_ChallengeSucceeded':
      if (golem.get('userVoteChoice') === '0') {
        return golem.set('tokensToClaim', fromJS(true)).set('status', fromJS('4'))
      } else {
        return golem.set('status', fromJS('4'))
      }
    case '_VoteCommitted':
      return golem.set(
        'totalVotes',
        fromJS(
          BN(golem.get('totalVotes'))
            .add(log.numTokens)
            .toString()
        )
      )
    case '_VoteRevealed':
      if (log.voter === account) {
        return golem
          .set('votesFor', fromJS(log.votesFor.toString()))
          .set('votesAgainst', fromJS(log.votesAgainst.toString()))
          .set('userVotes', fromJS(log.numTokens.toString()))
          .set('userVoteChoice', fromJS(log.choice.toString()))
      }
      return golem
        .set('votesFor', fromJS(log.votesFor.toString()))
        .set('votesAgainst', fromJS(log.votesAgainst.toString()))
    case '_RewardClaimed':
      if (log.voter === account) {
        return golem.set('tokensToClaim', fromJS(false))
      }
    default:
      return golem
  }
}

export async function updateAssortedListings(
  newListings,
  listings = fromJS({}),
  account
) {
  // sift through the new array
  return fromJS(newListings).reduce((acc, val) => {
    // find a matching listing in the accumulation array
    const match = findListing(val.get('logData'), acc)

    if (match && match.has('listingHash')) {
      const changed = changeListing(
        match,
        val.get('logData'),
        val.get('txData'),
        val.get('eventName'),
        account
      )
      return acc.set(match.get('listingHash'), changed)
    }
    return acc
  }, fromJS(listings))
}

export async function updateListings(newListings, listings = fromJS({})) {
  return fromJS(newListings).reduce((acc, val) => {
    if (
      val.hasIn(['logData', '_eventName']) ||
      !val.get('owner') ||
      !val.get('listingID') ||
      !val.get('status') ||
      !val.get('listingHash')
    ) {
      console.log('!not a listing!')
      return acc
    }

    const matchingListing = acc.get(val.get('listingHash'))
    // duplicate listingHash, older block.timestamp
    if (matchingListing && val.get('ts').lt(matchingListing.get('ts'))) {
      return acc
    }

    // either: new listingHash || newer block.timestamp
    return acc.set(val.get('listingHash'), fromJS(val))
  }, fromJS(listings))
}
