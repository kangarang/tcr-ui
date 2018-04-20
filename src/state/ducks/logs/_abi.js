import utils from 'ethers/utils'
import _ from 'lodash/fp'

// adapted from:
// https://github.com/0xProject/0x.js/blob/development/packages/0x.js/src/utils/filter_utils.ts#L15
const _abi = {
  getMethodAbi: async (address, methodName, abi) => {
    const methodAbi = _.find({ name: methodName }, abi)
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

    let eventAbi
    let evSigTopics = eventNames.map(eventName => {
      eventAbi = _.find({ name: eventName }, abi)
      const eventString = _abi.getEventStringFromAbiName(eventAbi, eventName)
      const eventSignature = utils.id(eventString)
      const eventSignatureTopic = utils.hexlify(eventSignature)
      return eventSignatureTopic
    })
    // console.log('evSigTopics:', evSigTopics)
    // note: eventAbi is now the last one in the array
    const topicsForIndexedArgs = _abi.getTopicsForIndexedArgs(eventAbi, indexFilterValues)
    const topics = [evSigTopics, ...topicsForIndexedArgs]
    let filter = {
      address,
      topics,
    }
    if (!_.isUndefined(blockRange)) {
      filter = {
        ...blockRange,
        ...filter,
      }
    }
    // console.log('filter:', filter)
    return filter
  },

  getEventStringFromAbiName: (eventAbi, eventName) => {
    const types = _.map('type', eventAbi.inputs)
    const signature = `${eventAbi.name}(${types.join(',')})`
    return signature
  },

  getTopicsForIndexedArgs: (abi, indexFilterValues) => {
    const topics = []
    for (const eventInput of abi.inputs) {
      if (!eventInput.indexed) {
        continue
      }
      if (_.isUndefined(indexFilterValues[eventInput.name])) {
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
    if (!_.isUndefined(filter.address) && log.address !== filter.address) {
      return false
    }
    if (!_.isUndefined(filter.topics)) {
      return _abi.matchesTopics(log.topics, filter.topics)
    }
    return true
  },

  matchesTopics(logTopics, filterTopics) {
    const matchesTopic = _.zipWith(_abi.matchesTopic.bind(_abi), logTopics, filterTopics)
    const matchesTopics = _.every(matchesTopic)
    return matchesTopics
  },

  matchesTopic(logTopic, filterTopic) {
    if (_.isArray(filterTopic)) {
      return _.includes(logTopic, filterTopic)
    }
    if (_.isString(filterTopic)) {
      return filterTopic === logTopic
    }
    // null topic is a wildcard
    return true
  },
}

export default _abi
