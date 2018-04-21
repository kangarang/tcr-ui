import { fromJS } from 'immutable'
import find from 'lodash/fp/find'

import { timestampToExpiry } from 'state/utils/_datetime'
import { getListingHash, isAddress } from 'state/libs/values'
import { BN } from 'state/libs/units'
import { ipfsGetData } from 'state/libs/ipfs'

export function findGolem(listingHash, listings) {
  return listings.get(listingHash)
}
export function findChallenge(challengeID, listings) {
  return listings.find((v, k) => v === challengeID.toString())
}

// Inputs: decodedLogs: Array, currentListings: Object
// Output: updatedListings: Object
// if the log is an application, transform into a new listing object
// if not, find the corresponding listing using the logData
export async function convertDecodedLogs(dLogs, listings = fromJS({})) {
  // TODO: convert to reducer
  return Promise.all(
    dLogs.map(async log => {
      const { logData, txData, msgSender, eventName } = log
      let golem
      if (eventName === '_Application') {
        const application = await createListing(logData, txData, msgSender)
        const old = listings.get(application.listingHash)
        if (old === undefined || BN(old.get('ts')).lt(BN(application.ts))) {
          return listings.set(application.listingHash, fromJS(application))
        }
      } else if (logData.listingHash) {
        // find the corresponding listing
        golem = await findGolem(logData.listingHash, fromJS(dLogs))
        console.log('golem:', golem)
      } else if (logData.pollID) {
        // console.log('poll id logData', logData)
        golem = await findChallenge(logData.pollID, listings)
      } else if (logData.challengeID) {
        // console.log('challenge id logData', logData)
        golem = await findChallenge(logData.challengeID, listings)
      }
      // imodify the existing listing
      if (golem !== undefined) {
        console.log('golem:', golem)
        const listing = changeListing(golem, logData, txData, eventName, msgSender)
        return listings.set(listing.listingHash, fromJS(listing))
      }
      return listings
    })
  )
  // return a new object of relevant listings
}

async function handleMultihash(listingHash, data) {
  const ipfsContent = await ipfsGetData(data)
  // validate (listingHash === keccak256(ipfsContent.id))
  if (listingHash === getListingHash(ipfsContent.id)) {
    const listingID = ipfsContent.id
    let tokenData
    // validate address
    if (isAddress(listingID.toLowerCase())) {
      // see: https://github.com/ethereum-lists/tokens
      const tokenList = await ipfsGetData(
        'QmchyVUfV34qD3HP23ZBX2yx4bHYzZNaVEiG1kWFiEheig'
      )
      tokenData = find({ address: listingID }, tokenList)
      if (tokenData) {
        tokenData.imgSrc = `https://raw.githubusercontent.com/kangarang/tokens/master/images/${tokenData.address.toLowerCase()}.png`
      } else {
        tokenData = {
          imgSrc: `https://raw.githubusercontent.com/kangarang/tokens/master/images/${listingID.toLowerCase()}.png`,
        }
      }
    }
    return { listingID, tokenData }
  }
  throw new Error('valid multihash, invalid id')
}

export async function createListing(log, blockTxn, owner) {
  let { listingHash, deposit, appEndDate, data } = log
  let listingID
  let tokenData = {}
  // application expiration details
  const appExpiry = await timestampToExpiry(appEndDate.toNumber())

  // IPFS multihash validation (RUT)
  if (data.length === 46 && data.includes('Qm')) {
    const res = await handleMultihash(listingHash, data)
    listingID = res.listingID
    tokenData = res.tokenData
    // keccak256 validation (ADT)
  } else if (listingHash === getListingHash(data)) {
    listingID = data
  }
  // TODO: validate for neither case

  // ------------------------------------------------
  // Golem: an animated anthropomorphic being that is
  // magically created entirely from inanimate matter
  // ------------------------------------------------

  const golem = {
    listingHash,
    owner,
    challenger: false,
    challengeID: false,
    pollID: false,
    status: '1',
    ...blockTxn,
    data,
    tokenData,
    listingID,
    unstakedDeposit: deposit.toString(10),
    appExpiry,
    commitExpiry: false,
    revealExpiry: false,
  }
  return golem
}

export function changeListing(golem, log, txData, eventName, msgSender) {
  if (txData.ts < golem.get('ts')) {
    console.log('old txn; returning listing')
    return golem
  }

  switch (eventName) {
    case '_Challenge':
      return golem
        .set('status', fromJS('2'))
        .set('challenger', fromJS(msgSender))
        .set('challengeID', fromJS(log.challengeID.toString()))
        .set('commitExpiry', timestampToExpiry(log.commitEndDate.toNumber()))
        .set('revealExpiry', timestampToExpiry(log.revealEndDate.toNumber()))

    case '_PollCreated':
      return golem
        .set('status', fromJS('2'))
        .set('pollID', fromJS(log.pollID.toString()))
        .set('commitExpiry', timestampToExpiry(log.commitEndDate.toNumber()))
        .set('revealExpiry', timestampToExpiry(log.revealEndDate.toNumber()))
    case '_VoteCommitted':
      return {
        ...golem,
        status: '2',
        pollID: log.pollID.toString(),
      }
    case '_VoteRevealed':
      return {
        ...golem,
        status: '2',
        pollID: log.pollID.toString(),
        votesFor: log.votesFor.toString(),
        votesAgainst: log.votesAgainst.toString(),
      }

    case '_ApplicationWhitelisted':
    case '_ChallengeFailed':
      return golem
        .set('status', fromJS('3'))
        .set('challenger', fromJS(false))
        .set('challengeID', fromJS(false))
        .set('commitExpiry', fromJS(false))
        .set('revealExpiry', fromJS(false))

    case '_ApplicationRemoved':
    case '_ListingRemoved':
    case '_ChallengeSucceeded':
      return golem
        .set('status', fromJS('0'))
        .set('challenger', fromJS(false))
        .set('challengeID', fromJS(false))
        .set('commitExpiry', fromJS(false))
        .set('revealExpiry', fromJS(false))

    default:
      return golem
  }
}
