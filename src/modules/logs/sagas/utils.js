import utils from 'ethers/utils'
import map from 'lodash/fp/map'
import find from 'lodash/fp/find'
import every from 'lodash/fp/every'
import zipWith from 'lodash/fp/zipWith'
import isArray from 'lodash/fp/isArray'
import includes from 'lodash/fp/includes'
import isString from 'lodash/fp/isString'
import isUndefined from 'lodash/fp/isUndefined'
import { v4 } from 'node-uuid'

export async function getBlockAndTxnFromLog(log, ethjs) {
  const block = await ethjs.getBlockByHash(log.blockHash, false)
  const tx = await ethjs.getTransactionByHash(log.transactionHash)
  return { block, tx }
}

export const eventTypes = {
  _Application: 'info',
  _ApplicationWhitelisted: 'success',
  _ApplicationRemoved: 'error',
  _Challenge: 'info',
  _VoteCommitted: 'info',
  _VoteRevealed: 'info',
  _ReparameterizationProposal: 'info',
  _NewChallenge: 'info',
  _ProposalAccepted: 'info',
  _ChallengeSucceeded: 'info',
  _ChallengeFailed: 'info',
  _ListingRemoved: 'error',
  _ListingWithdrawn: 'info',
  Approval: 'success',
  Transfer: 'success',
  _TokensRescued: 'info',
  _RewardClaimed: 'success',
}

// Create a general notification from an event
export function generateNoti(uid, title, message, action) {
  return {
    uid: v4(),
    title,
    message,
    position: 'tl',
    autoDismiss: 0,
    dismissible: 'both',
    action,
  }
}

export function getNotificationTitleAndMessage(eventName, logData, tcr, listing) {
  let title, message
  switch (eventName) {
    case '_Application':
      title = `Application ${logData.listingID} applied`
      message = 'Click to review the listing'
      break
    case '_ApplicationWhitelisted':
      title = `Application ${listing.listingID} was added to the registry`
      message = 'Click to review the listing'
      break
    case '_ApplicationRemoved':
      title = `Application ${listing.listingID} removed`
      message = `View application ${listing.listingID} history`
      break
    case '_Challenge':
      title = `Application ${listing.listingID} was challenged`
      message = 'Click to vote'
      break
    case 'Approval':
      title = 'Tokens approved'
      message = 'View on Etherscan'
      break
    case '_VoteCommitted':
      title = `${logData.numTokens} tokens successfully committed`
      message = `Go to voting for ${listing.listingID}`
      break
    case '_VoteRevealed':
      title = 'Vote revealed'
      message = `Go to voting for ${listing.listingID}`
      break
    case '_TokensRescued':
      title = 'Tokens successfully rescued'
      message = 'View token transaction'
    case '_ChallengeSucceeded':
      title = `Challenge against ${listing.listingID} succeeded`
      message = 'View challenge'
      break
    case '_ChallengeFailed':
      title = `Challenge against ${listing.listingID} failed!`
      message = `Votes in favor of listing: ${logData.votesFor}\nVotes against listing: ${
        logData.votesAgainst
      }`
      break
    case '_RewardClaimed':
      title = 'Successfully claimed reward'
      message = 'View token transaction'
      break
    case '_ListingRemoved':
      title = 'Listing `name` removed'
      message = 'View exit information'
      break
    case '_ListingWithdrawn':
      title = `Listing ${listing.listingID} withdrawn`
      message = `${listing.listingID} is no longer on the whitelist`
      break
    case 'Transfer':
      title = 'Transfer was successful'
      message = 'View transfer on Etherscan'
      break
    case '_ReparameterizationProposal':
      title = 'Parameter `name` proposed to be `proposal`' // Check if valid parameter?
      message = 'View parameter proposal'
      break
    case '_NewChallenge':
      title = 'Parameter `name` was challenged'
      message = 'Click to vote'
      break
    case '_ProposalAccepted':
      title = '`proposal` accepted'
      message = 'View parameter proposal'
      break
    default:
      title = `Event: ${eventName}`
      message = ''
      break
  }
  return { title, message }
}

// adapted from:
// https://github.com/0xProject/0x.js/blob/development/packages/0x.js/src/utils/filter_utils.ts#L15
const _utils = {
  getMethodAbi: async (methodName, abi) => {
    // prettier-ignore
    const methodAbi = find({ 'name': methodName }, abi)
    return methodAbi
  },

  getFilter: async (address, eventNames, indexFilterValues = {}, abi, blockRange) => {
    if (eventNames.length === 0) {
      const filter = {
        address: address,
        topics: [],
      }
      return {
        ...blockRange,
        ...filter,
      }
    }

    const evSigTopics = eventNames.map(eventName => {
      // prettier-ignore
      const eventAbi = find({ 'name': eventName }, abi)
      const eventString = _utils.getEventStringFromAbiName(eventAbi, eventName)
      const eventSignature = utils.id(eventString)
      const eventSignatureTopic = utils.hexlify(eventSignature)
      return eventSignatureTopic
    })

    // note: indexed args reserved for first eventName in array
    // prettier-ignore
    const eventAbi = find({ 'name': eventNames[0] }, abi)
    const topicsForIndexedArgs = _utils.getTopicsForIndexedArgs(
      eventAbi,
      indexFilterValues
    )
    const topics = [evSigTopics, ...topicsForIndexedArgs]
    let filter = {
      address,
      topics,
    }
    if (!isUndefined(blockRange)) {
      filter = {
        ...blockRange,
        ...filter,
      }
    }
    // console.log('filter:', filter)
    return filter
  },

  getEventStringFromAbiName: (eventAbi, eventName) => {
    const types = map('type', eventAbi.inputs)
    const signature = `${eventAbi.name}(${types.join(',')})`
    return signature
  },

  getTopicsForIndexedArgs: (abi, indexFilterValues) => {
    const topics = []
    for (const eventInput of abi.inputs) {
      if (!eventInput.indexed) {
        continue
      }
      if (isUndefined(indexFilterValues[eventInput.name])) {
        // Null is a wildcard topic in a JSON-RPC call
        topics.push(null)
      } else {
        const value = indexFilterValues[eventInput.name]
        // An arrayish object is any such that it:
        // has a length property
        // has a value for each index from 0 up to (but excluding) length
        // has a valid byte for each value; a byte is an integer in the range [0, 255]
        // is NOT a string
        const arrayish = utils.arrayify(value)
        // zeros prepended to 32 bytes
        const padded = utils.padZeros(arrayish, 32)
        const topic = utils.hexlify(padded)
        topics.push(topic)
      }
    }
    return topics
  },

  matchesFilter(log, filter) {
    if (!isUndefined(filter.address) && log.address !== filter.address) {
      return false
    }
    if (!isUndefined(filter.topics)) {
      return _utils.matchesTopics(log.topics, filter.topics)
    }
    return true
  },

  matchesTopics(logTopics, filterTopics) {
    const matchesTopic = zipWith(
      _utils.matchesTopic.bind(_utils),
      logTopics,
      filterTopics
    )
    const matchesTopics = every(matchesTopic)
    return matchesTopics
  },

  matchesTopic(logTopic, filterTopic) {
    if (isArray(filterTopic)) {
      return includes(logTopic, filterTopic)
    }
    if (isString(filterTopic)) {
      return filterTopic === logTopic
    }
    // null topic is a wildcard
    return true
  },
}

export default _utils
