import find from 'lodash/fp/find'

import { timestampToExpiry } from 'state/utils/_datetime'
import { getListingHash, isAddress } from 'state/libs/values'
import { ipfsGetData } from 'state/libs/ipfs'

// Get
export function findGolem(listingHash, listings) {
  return listings[listingHash]
}
export function findChallenge(challengeID, listings) {
  return Object.values(listings).filter(li => li.challengeID.toString() === challengeID.toString())
}

// Create
export async function createListing(log, blockTxn, owner) {
  let { listingHash, deposit, appEndDate, data } = log
  let listingID
  let tokenData

  // IPFS input validations
  // Check if the data is a valid ipfs multihash
  if (data.length === 46 && data.includes('Qm')) {
    const ipfsContent = await ipfsGetData(data)
    if (listingHash === getListingHash(ipfsContent.id)) {
      listingID = ipfsContent.id
      // Validate listingHash === keccak256(ipfsContent.id)
      if (isAddress(listingID.toLowerCase())) {
        // see: https://github.com/ethereum-lists/tokens
        const tokenList = await ipfsGetData('QmchyVUfV34qD3HP23ZBX2yx4bHYzZNaVEiG1kWFiEheig')
        tokenData = find({ address: listingID }, tokenList)
        if (tokenData) {
          tokenData.imgSrc = `https://raw.githubusercontent.com/TrustWallet/tokens/master/images/${tokenData.address.toLowerCase()}.png`
          console.log('tokenData', tokenData)
        } else {
          tokenData = {}
          tokenData.imgSrc = `https://raw.githubusercontent.com/TrustWallet/tokens/master/images/${listingID.toLowerCase()}.png`
        }
      }
    } else {
      throw new Error('valid multihash, invalid id')
    }
  } else if (listingHash === getListingHash(data)) {
    // Validate listingHash === keccak256(data)
    listingID = data
  }
  // TODO: account for neither case

  // application expiration details
  const appExpiry = await timestampToExpiry(appEndDate.toNumber())

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
    tokenData,
    listingID,
    unstakedDeposit: deposit.toString(),
    appExpiry,
    commitExpiry: false,
    revealExpiry: false,
  }
  return golem
}

// Update
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
      return {
        ...golem,
        status: '3',
        challenger: false,
        challengeID: false,
        commitExpiry: false,
        revealExpiry: false,
      }
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
      return {
        ...golem,
        status: '0',
        challenger: false,
        challengeID: false,
        commitExpiry: false,
        revealExpiry: false,
      }
    case '_ListingRemoved':
      return {
        ...golem,
        status: '0',
        challenger: false,
        challengeID: false,
        commitExpiry: false,
        revealExpiry: false,
      }
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
