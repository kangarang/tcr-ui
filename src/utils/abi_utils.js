import ethUtil from 'ethereumjs-util'
import _ from 'lodash'
import jsSHA3 from 'js-sha3'

const TOPIC_LENGTH = 32

// adapted from:
// https://github.com/0xProject/0x.js/blob/development/packages/0x.js/src/utils/filter_utils.ts#L15
const abi_utils = {
  getMethodAbi: async (address, methodName, abi) => {
    const methodAbi = _.find(abi, { name: methodName })
    return methodAbi
  },

  getFilter: async (address, eventName, indexFilterValues, abi, blockRange) => {
    let eventAbi
    if (!eventName) {
      const filter = {
        address: address,
        topics: [],
      }
      return {
        ...blockRange,
        ...filter,
      }
    } else {
      eventAbi = _.find(abi, { name: eventName })
    }
    console.log('eventAbi', eventAbi)
    const eventSignature = abi_utils.getEventSignatureFromAbiByName(
      eventAbi,
      eventName
    )
    const topicForEventSignature = ethUtil.addHexPrefix(
      jsSHA3.keccak256(eventSignature)
    )
    const topicsForIndexedArgs = abi_utils.getTopicsForIndexedArgs(
      eventAbi,
      indexFilterValues
    )
    const topics = [topicForEventSignature, ...topicsForIndexedArgs]
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
    return filter
  },

  getEventSignatureFromAbiByName: (eventAbi, eventName) => {
    const types = _.map(eventAbi.inputs, 'type')
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
        const buffer = ethUtil.toBuffer(value)
        const paddedBuffer = ethUtil.setLengthLeft(buffer, TOPIC_LENGTH)
        const topic = ethUtil.bufferToHex(paddedBuffer)
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
      return abi_utils.matchesTopics(log.topics, filter.topics)
    }
    return true
  },

  matchesTopics(logTopics, filterTopics) {
    const matchesTopic = _.zipWith(
      logTopics,
      filterTopics,
      abi_utils.matchesTopic.bind(abi_utils)
    )
    const matchesTopics = _.every(matchesTopic)
    return matchesTopics
  },

  matchesTopic(logTopic, filterTopic) {
    if (_.isArray(filterTopic)) {
      return _.includes(filterTopic, logTopic)
    }
    if (_.isString(filterTopic)) {
      return filterTopic === logTopic
    }
    // null topic is a wildcard
    return true
  },
}

export default abi_utils
