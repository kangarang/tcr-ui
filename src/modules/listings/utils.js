import { fromJS } from 'immutable'
import find from 'lodash/fp/find'

import tokenList from 'config/tokens/eth.json'

import { getListingHash, isAddress } from 'libs/values'
import { timestampToExpiry } from 'utils/_datetime'
import { ipfsGetData } from 'libs/ipfs'
import { saveLocal } from 'utils/_localStorage'

export async function handleMultihash(listingHash, data) {
  const ipfsContent = await ipfsGetData(data)
  // validate (listingHash === keccak256(ipfsContent.id))
  if (listingHash === getListingHash(ipfsContent.id)) {
    const listingID = ipfsContent.id
    let tokenData = {}

    // validate address
    if (isAddress(listingID.toLowerCase())) {
      tokenData = find(
        toke => toke.address.toLowerCase() === listingID.toLowerCase(),
        tokenList
      )
      // console.log('tokenData:', tokenData)

      // TODO: move to api module
      const baseUrl = `https://raw.githubusercontent.com/kangarang/token-icons/master/images/`

      if (tokenData && tokenData.address) {
        tokenData.imgSrc = `${baseUrl}${tokenData.address.toLowerCase()}.png`
      } else {
        tokenData = {
          imgSrc: ``,
          // symbol: 'DEFAULT',
          // name: 'Default Token',
          // totalSupply: 1245127,
        }
      }
    } else if (ipfsContent.data) {
      tokenData.imgSrc = ipfsContent.data
    }
    return { listingID, tokenData }
  }
  throw new Error('valid multihash, invalid id')
}

// creates a listing entity from _Application log
// I - decoded log, block/tx info, msgSender
// O - listing object
export async function createListing(log, blockTxn, owner) {
  let { listingHash, deposit, appEndDate, listingID, listingData, _eventName } = log
  if (_eventName !== '_Application') {
    throw new Error('not an application')
  }
  // let listingID
  let tokenData = {}
  let data = listingData

  // IPFS multihash validation (RUT)
  if (listingData.length === 46 && listingData.startsWith('Qm')) {
    const res = await handleMultihash(listingHash, listingData)
    listingID = res.listingID
    tokenData = res.tokenData
  } else if (isAddress(listingData.toLowerCase())) {
    // TODO: keccak256 validation (ADT)
    // listingID = data
    // tokenData.imgSrc = `https://www.google.com/s2/favicons?domain=${data}`
  } else if (listingData) {
    tokenData.imgSrc = listingData
  } else {
    tokenData.imgSrc = ''
  }
  // TODO: validate for neither case

  // starting structure for every listing entity
  const listing = {
    listingHash,
    owner,
    data,
    tokenData,
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
  }

  // save to local storage
  await saveLocal(listingHash, listing)
  return listing
}

// TODO: move into actual reducer and change the redux store directly for clarity
export function changeListing(golem, log, txData, eventName) {
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
        .set('challengeData', fromJS(log.data.toString()))
        .set('commitExpiry', fromJS(timestampToExpiry(log.commitEndDate.toNumber())))
        .set('revealExpiry', fromJS(timestampToExpiry(log.revealEndDate.toNumber())))
    case '_ApplicationWhitelisted':
    case '_ChallengeFailed':
      return golem.set('status', fromJS('3'))
    case '_ApplicationRemoved':
    case '_ListingRemoved':
    case '_ChallengeSucceeded':
      return golem.set('status', fromJS('4'))
    case '_VoteRevealed':
      return golem
        .set('votesFor', fromJS(log.votesFor))
        .set('votesAgainst', fromJS(log.votesAgainst))
        .set('pollID', fromJS(log.pollID.toString()))
    default:
      return golem
  }
}

// Finds the corresponding listing according the eventName
export function findListing(logData, listings) {
  switch (logData._eventName) {
    case '_Application':
    case '_Challenge':
    case '_ApplicationWhitelisted':
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

export async function updateAssortedListings(newListings, listings = fromJS({})) {
  return fromJS(newListings).reduce((acc, val) => {
    const match = findListing(val.get('logData'), acc)
    if (match && match.has('listingHash')) {
      const changed = changeListing(
        match,
        val.get('logData'),
        val.get('txData'),
        val.get('eventName')
      )
      // // get claimReward
      // if ((changed.get('status') === '3') && changed.get('challengeID')) {

      // }
      return acc.set(match.get('listingHash'), changed)
    }
    return acc
  }, fromJS(listings))
}

// only return _Application listings
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
    if (matchingListing && val.get('ts').lt(matchingListing.get('ts'))) {
      // duplicate listingHash, older block.timestamp
      return acc
    }
    // new listingHash || newer block.timestamp
    return acc.set(val.get('listingHash'), fromJS(val))
  }, fromJS(listings))
}
