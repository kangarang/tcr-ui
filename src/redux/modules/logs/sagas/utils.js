import utils from 'ethers/utils'
import find from 'lodash/fp/find'
import map from 'lodash/fp/map'
import zipWith from 'lodash/fp/zipWith'
import every from 'lodash/fp/every'
import isUndefined from 'lodash/fp/isUndefined'
import isString from 'lodash/fp/isString'
import isArray from 'lodash/fp/isArray'
import includes from 'lodash/fp/includes'
import { baseToConvertedUnit } from '../../../libs/units'

export async function getBlockAndTxnFromLog(log, ethjs) {
  const block = await ethjs.getBlockByHash(log.blockHash, false)
  const tx = await ethjs.getTransactionByHash(log.transactionHash)
  return { block, tx }
}

export function getNotificationTitleAndMessage(eventName, logData, tcr, listing) {
  let title, message
  switch (eventName) {
    case '_Application':
      title = `New application: ${listing.tokenData.name} (${listing.tokenData.symbol})`
      message = `Token address: ${logData.data}`
      break
    case '_Challenge':
      title = `New challenge against: ${listing.tokenData.name}`
      message = `${
        listing.listingID
      } was challenged. Poll: ${logData.challengeID.toString()}`
      break
    case '_VoteCommitted':
      title = `${baseToConvertedUnit(
        logData.numTokens,
        tcr.get('tokenDecimals')
      )} ${tcr.get('tokenSymbol')} committed`
      message = `Ends: ${listing.commitExpiry.date}`
      break
    case '_VoteRevealed':
      title = `${baseToConvertedUnit(
        logData.numTokens,
        tcr.get('tokenDecimals')
      )} ${tcr.get('tokenSymbol')} revealed`
      message = `Current votesFor: ${baseToConvertedUnit(
        logData.votesFor,
        tcr.get('tokenDecimals')
      )} votesAgainst: ${baseToConvertedUnit(
        logData.votesAgainst,
        tcr.get('tokenDecimals')
      )}. Ends: ${listing.revealExpiry.date}`
      break
    case '_ApplicationWhitelisted':
      title = `Application added to the registry`
      message = `Token: ${listing.tokenData.name} (${listing.tokenData.symbol})`
      break
    case '_ChallengeFailed':
      title = `Listing: ${listing.tokenData.name} remains whitelisted after challenge`
      message = `votesFor: ${listing.votesFor}, votesAgainst: ${
        listing.votesAgainst
      }, voterReward: ${listing.voterReward}, challengeReward: ${listing.challengeReward}`
      break
    case '_ChallengeSucceeded':
      title = `Application: ${listing.tokenData.name} removed after challenge`
      message = `votesFor: ${listing.votesFor}, votesAgainst: ${
        listing.votesAgainst
      }, voterReward: ${listing.voterReward}, challengeReward: ${listing.challengeReward}`
      break
    case '_ListingRemoved':
      title = 'Listing removed after challenge'
      message = `Token: ${listing.tokenData.name} (${listing.tokenData.symbol})`
      break
    case '_PollCreated':
      // title = 'Poll created'
      // message = `Poll: ${logData.pollID.toString()}`
      title = false
      message = false
      break
    default:
      title = 'default title'
      message = `event: ${logData._eventName}`
  }
  return { title, message }
}

// adapted from:
// https://github.com/0xProject/0x.js/blob/development/packages/0x.js/src/utils/filter_utils.ts#L15
const _utils = {
  getMethodAbi: async (address, methodName, abi) => {
    // prettier-ignore
    const methodAbi = find({ 'name': methodName }, abi)
    return methodAbi
  },

  getFilter: async (address, eventNames, indexFilterValues, abi, blockRange) => {
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
