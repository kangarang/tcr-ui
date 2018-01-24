import EthAbi from 'ethjs-abi'
import ethUtil from 'ethereumjs-util'
import abi from 'ethereumjs-abi'
import _ from 'lodash'
import jsSHA3 from 'js-sha3'
// import { normalize, schema } from 'normalizr'

// const log = new schema.Entity('logs')
// const transaction = new schema.Entity('transactions', {
//   logs: [log],
// })
// const block = new schema.Entity('blocks', {
//   transactions: [transaction],
// })
// const originalData = {
//   block: {
//     number: '11248',
//     timestamp: '',
//   },
//   transactions: [
//     {
//       logsbloom: [
//         {
//           logIndex: '0',
//           data: '0x',
//         },
//         {
//           logIndex: '2',
//           data: '0x',
//         },
//       ],
//       txHash: '0x',
//       txIndex: '0',
//     },
//   ],
// }
// const normalizedData = normalize(originalData, block)

const TOPIC_LENGTH = 32

// adapted from: 
// https://github.com/0xProject/0x.js/blob/development/packages/0x.js/src/utils/filter_utils.ts#L15
export const filterUtils = {
  getFilter: async (address, eventName, indexFilterValues, abi, blockRange) => {
    const eventAbi = _.find(abi, { name: eventName })
    const eventSignature = filterUtils.getEventSignatureFromAbiByName(
      eventAbi,
      eventName
    )
    const topicForEventSignature = ethUtil.addHexPrefix(
      jsSHA3.keccak256(eventSignature)
    )
    const topicsForIndexedArgs = filterUtils.getTopicsForIndexedArgs(
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
      return filterUtils.matchesTopics(log.topics, filter.topics)
    }
    return true
  },
  matchesTopics(logTopics, filterTopics) {
    const matchesTopic = _.zipWith(
      logTopics,
      filterTopics,
      filterUtils.matchesTopic.bind(filterUtils)
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

// Logs helpers
export const logUtils = {
  getBlock: async (eth, hash) => eth.getBlockByHash(hash, false),
  getTransaction: async (eth, hash) => eth.getTransactionByHash(hash),

  getListingHash: listing =>
    `0x${abi.soliditySHA3(['string'], [listing]).toString('hex')}`,

  canAnyBeWhitelisted: async (registry, logs) =>
    registry.filterListingAndCall(logs, 'canBeWhitelisted'),

  shapeShift: (block, tx, details) => ({
    listing: details.listingString,
    listingHash: details.listingHash,
    owner: tx.from,
    challenger: details.pollID && details.challenger,
    latest: {
      whitelisted: details.isWhitelisted,
      canBeWhitelisted: details.canBeWhitelisted,
      blockHash: details.blockHash,
      blockNumber: details.blockNumber,
      timestamp: block.timestamp && new Date(block.timestamp.toNumber(10)),
      txHash: tx.hash,
      txIndex: tx.index.toString(10),
      sender: tx.from,
      numTokens: details.unstakedDeposit
        ? details.unstakedDeposit.toString(10)
        : false,
      event: details.eventName,
      logIndex: details.index.toString(10),
      pollID: details.pollID ? details.pollID.toString(10) : false,
    },
  }),
}