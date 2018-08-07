import utils from 'ethers/utils'
import map from 'lodash/fp/map'
import find from 'lodash/fp/find'
import every from 'lodash/fp/every'
import zipWith from 'lodash/fp/zipWith'
import isArray from 'lodash/fp/isArray'
import includes from 'lodash/fp/includes'
import isString from 'lodash/fp/isString'
import isUndefined from 'lodash/fp/isUndefined'

// adapted from:
// https://github.com/0xProject/0x.js/blob/development/packages/0x.js/src/utils/filter_utils.ts#L15
const _utils = {
  getBlockAndTxnFromLog: async (rawLog, ethjs) => {
    const block = await ethjs.getBlockByHash(rawLog.blockHash, false)
    const tx = await ethjs.getTransactionByHash(rawLog.transactionHash)
    return { block, tx }
  },

  getFilter: async (address, eventNames, indexFilterValues = {}, abi, blockRange) => {
    if (eventNames.length === 0) {
      return {
        fromBlock: blockRange.fromBlock,
        toBlock: blockRange.toBlock,
        address: address,
        topics: [],
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
        fromBlock: blockRange.fromBlock,
        toBlock: blockRange.toBlock,
        address: filter.address,
        topics: filter.topics,
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
