import find from 'lodash/fp/find'

import { timestampToExpiry } from 'state/utils/_datetime'
import { getListingHash, isAddress } from 'state/libs/values'
import { ipfsGetData } from 'state/libs/ipfs'

export function findGolem(listingHash, listings) {
  return listings[listingHash]
}
export function findChallenge(challengeID, listings) {
  return Object.values(listings).filter(li => li.challengeID.toString() === challengeID.toString())
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
      listing = await createListing(logData, txData, msgSender)
      listings[listing.listingHash] = listing
    } else if (logData.listingHash) {
      // if listingHash exists, find the corresponding listing
      golem = findGolem(logData.listingHash, listings)
    } else if (logData.pollID) {
      // if pollID or challengeID exists, find the corresponding challenge
      // console.log('poll id logData', logData)
      golem = findChallenge(logData.pollID, listings)[0]
    } else if (logData.challengeID) {
      // console.log('challenge id logData', logData)
      golem = findChallenge(logData.challengeID, listings)[0]
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
  // console.log('converted logs/listings', listings)
  // return a new object of relevant listings
  return listings
}

export async function createListing(log, blockTxn, owner) {
  let { listingHash, deposit, appEndDate, data } = log
  let listingID
  let tokenData = {}

  // IPFS input validations
  if (data.length === 46 && data.includes('Qm')) {
    const ipfsContent = await ipfsGetData(data)

    // Validate listingHash === keccak256(ipfsContent.id)
    if (listingHash === getListingHash(ipfsContent.id)) {
      listingID = ipfsContent.id

      if (isAddress(listingID.toLowerCase())) {
        // see: https://github.com/ethereum-lists/tokens
        const tokenList = await ipfsGetData('QmchyVUfV34qD3HP23ZBX2yx4bHYzZNaVEiG1kWFiEheig')
        tokenData = find({ address: listingID }, tokenList)

        if (tokenData) {
          tokenData.imgSrc = `https://raw.githubusercontent.com/kangarang/tokens/master/images/${tokenData.address.toLowerCase()}.png`
          console.log('tokenData', tokenData)
        } else {
          tokenData = {}
          tokenData.imgSrc = `https://raw.githubusercontent.com/kangarang/tokens/master/images/${listingID.toLowerCase()}.png`
          console.log('tokenData', tokenData)
        }
      }
    } else {
      throw new Error('valid multihash, invalid id')
    }
  } else if (listingHash === getListingHash(data)) {
    // Validate listingHash === keccak256(data) -- adChain
    listingID = data
  }
  // TODO: account for neither case

  // application expiration details
  const appExpiry = await timestampToExpiry(appEndDate.toNumber())

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
  if (txData.ts < golem.ts) {
    console.log('old txn; returning listing')
    return golem
  }

  switch (eventName) {
    case '_Challenge':
      return {
        ...golem,
        status: '2',
        challenger: msgSender,
        challengeID: log.challengeID.toString(),
        commitExpiry: timestampToExpiry(log.commitEndDate.toNumber()),
        revealExpiry: timestampToExpiry(log.revealEndDate.toNumber()),
      }

    case '_PollCreated':
      return {
        ...golem,
        status: '2',
        pollID: log.pollID.toString(),
        commitExpiry: timestampToExpiry(log.commitEndDate.toNumber()),
        revealExpiry: timestampToExpiry(log.revealEndDate.toNumber()),
      }
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
      return {
        ...golem,
        status: '3',
        challenger: false,
        challengeID: false,
        commitExpiry: false,
        revealExpiry: false,
      }

    case '_ApplicationRemoved':
    case '_ListingRemoved':
    case '_ChallengeSucceeded':
      return {
        ...golem,
        status: '0',
        challenger: false,
        challengeID: false,
        commitExpiry: false,
        revealExpiry: false,
      }
    default:
      return golem
  }
}
