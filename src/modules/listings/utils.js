import { fromJS } from 'immutable'
import find from 'lodash/fp/find'

import tokenList from 'config/tokens/eth.json'

import { getListingHash, isAddress } from 'libs/values'
import { BN } from 'libs/units'
import { ipfsCheckMultihash, ipfsGetData } from 'libs/ipfs'
import { timestampToExpiry } from 'utils/_datetime'

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
  // TODO: handle error. Users should be notified that this applicant
  // did not use the proper formatting conventions when submitting the application
  // Keccak256 validation to make sure it's the correct hash of the ipfs content's id
  if (listingHash === getListingHash(ipfsContent.id)) {
    const listingID = ipfsContent.id
    let listingData = {}

    // TODO: validate that this address resolves to a ERC20 token smart contract
    // If the listingID is an Ethereum address,
    // use the token api to retrieve the resources
    if (isAddress(listingID.toLowerCase())) {
      // TODO: move to api module
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
      // TODO: validate that data is a valid image uri when resolved
    } else if (ipfsContent.data) {
      listingData.imgSrc = ipfsContent.data
    }
    return { listingID, listingData }
  }
  throw new Error('valid multihash, invalid id')
}

// Creates a flat listing object from an _Application log and some transaction information
// returns the built Listing
export async function createListing(logData, txData) {
  // prettier-ignore
  let { listingHash, deposit, appEndDate, listingID, data, _eventName, applicant } = logData
  if (_eventName !== '_Application') {
    throw new Error('not an application')
  }
  let listingData = {}

  // IPFS multihash validation
  if (!listingID && ipfsCheckMultihash(data)) {
    // CASE: Prospect Park -- data is an ipfs pointer, content.id is identifier, content.data is metadata
    // const res = await handleMultihash(listingHash, data)
    // listingID = res.listingID
    // listingData = res.listingData
    listingID = data
  } else if (data && !listingID) {
    // CASE: Prospect Park -- data is identifier
    listingID = data
    data = ''
  } else if (data && listingID) {
    // CASE: kangarang/tcr fork -- listingID is identifier, data is metadata
    listingData.imgSrc = data
  } else {
    listingData.imgSrc = ''
  }

  const appExpiry = timestampToExpiry(appEndDate.toNumber())
  // prettier-ignore
  // Initial proto-structure for each listing entity
  const listing = {
    listingHash,                  // on-chain listing identifier
    owner: applicant,             // the applicant is the listing's owner
    data,                         // evm output
    listingID,                    // string identifier
    listingData,                  // applicant metadata
    status: 'applications',       // determines conditional rendering. can be 1 of: applications, whitelist, faceoffs, removed
    unstakedDeposit: deposit,     // applicant's security deposit
    appExpiry,                    // info about the application period
    pollID: false,                // if challenged, will become the challenge's challengeID / poll's pollID
    challenger: false,            // address of one who submits a challenge against this listing
    challengeID: false,           // if challenged, will become the challenge's challengeID / poll's pollID
    challengeData: false,         // challenger metadata
    commitExpiry: {},             // info about the commit period
    revealExpiry: {},             // info about the reveal period
    votesFor: '',                 // accumulation of tokens committed & revealed: IN_SUPPORT for the listing's registry candidacy
    votesAgainst: '',             // accumulation of tokens committed & revealed: IN_OPPOSITION to the listing's registry candidacy
    userVotes: '',                // number of tokens User revealed during the challenge period for the listing
    totalVotes: '0',              // accumulation of tokens committed during the challenge period for the listing
    tokensToClaim: false,         // boolean indicating to the User that they are eligible to claimRewards for the listing
    userVoteChoice: '',           // set when revealing a vote for this listing
    latestBlockTxn: txData,       // the most recent block & transaction information, potentially mutating the listing's values
    whitelistBlockTimestamp: '',  // date of the listing's entry into the registry
  }
  return listing
}

// Before this function is executed,
// a match (oldGolem) is found that corresponds with the event emission args (listingHash or pollID)
export function changeListing(oldGolem, log, txData, eventName, account) {
  // prettier-ignore
  // First, validate that the incoming log's txData is newer than the listing's latest tx info
  if (txData.get('blockTimestamp') < oldGolem.getIn(['latestBlockTxn', 'blockTimestamp'])) {
    console.log('old txn; returning listing', eventName, log, oldGolem.toJS())
    // Return the listing as is cause this is not a valid update
    return oldGolem
  }
  // Set the listing's latest tx info to the incoming one
  const golem = oldGolem.set('latestBlockTxn', fromJS(txData))

  switch (eventName) {
    case '_Challenge':
      return golem
        .set('status', fromJS('faceoffs'))
        .set('challenger', fromJS(log.challenger))
        .set('challengeID', fromJS(log.challengeID.toString()))
        .set('pollID', fromJS(log.challengeID.toString()))
        .set('challengeData', fromJS(log.data.toString()))
        .set('commitExpiry', fromJS(timestampToExpiry(log.commitEndDate.toNumber())))
        .set('revealExpiry', fromJS(timestampToExpiry(log.revealEndDate.toNumber())))
    case '_ApplicationWhitelisted':
    case '_ChallengeFailed':
      // If the User revealed a vote for this challenge, and they voted IN_SUPPORT of the applicant,
      // then the User voted in the majority bloc of voters, and thus has tokens to claim
      if (golem.get('userVoteChoice') === '1') {
        return golem
          .set('tokensToClaim', fromJS(true))
          .set('status', fromJS('whitelist'))
          .set('whitelistBlockTimestamp', fromJS(txData.get('blockTimestamp')))
      } else {
        // Otherwise, make default changes to the listing
        return golem
          .set('status', fromJS('whitelist'))
          .set('whitelistBlockTimestamp', fromJS(txData.get('blockTimestamp')))
      }
    case '_ApplicationRemoved':
    case '_ListingRemoved':
    case '_ChallengeSucceeded':
      // Vice-versa here
      if (golem.get('userVoteChoice') === '0') {
        return golem
          .set('tokensToClaim', fromJS(true))
          .set('status', fromJS('removed'))
          .set('whitelistBlockTimestamp', fromJS(''))
      } else {
        return golem
          .set('status', fromJS('removed'))
          .set('whitelistBlockTimestamp', fromJS(''))
      }
    case '_PollCreated':
      return golem
        .set('status', fromJS('faceoffs'))
        .set('challengeID', fromJS(log.pollID.toString()))
        .set('pollID', fromJS(log.pollID.toString()))
    case '_VoteCommitted':
      // prettier-ignore
      // Increment the total votes committed to this listing
      // w/ the numTokens committed during this particular event log
      return golem.set('totalVotes',
        fromJS(BN(golem.get('totalVotes')).add(log.numTokens).toString())
      )
    case '_VoteRevealed':
      // If this log came from the User,
      // set the values of the User's voteOption and numTokens for this poll
      if (log.voter === account) {
        return golem
          .set('votesFor', fromJS(log.votesFor.toString()))
          .set('votesAgainst', fromJS(log.votesAgainst.toString()))
          .set('userVotes', fromJS(log.numTokens.toString()))
          .set('userVoteChoice', fromJS(log.choice.toString()))
      } else {
        return golem
          .set('votesFor', fromJS(log.votesFor.toString()))
          .set('votesAgainst', fromJS(log.votesAgainst.toString()))
      }
    case '_RewardClaimed':
      // If this log came from the User,
      // the User no longer has reward tokens to claim from this poll
      if (log.voter === account) {
        return golem.set('tokensToClaim', fromJS(false))
      } else {
        return golem
      }
    default:
      console.log('unhandled event:', eventName)
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
    if (
      matchingListing &&
      val.getIn(['latestBlockTxn', 'blockTimestamp']) <
        matchingListing.getIn(['latestBlockTxn', 'blockTimestamp'])
    ) {
      return acc
    }

    return acc.set(val.get('listingHash'), fromJS(val))
  }, fromJS(listings))
}
