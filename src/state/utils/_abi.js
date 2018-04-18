// import utils from 'ethers/utils'
// import _ from 'lodash'

// // adapted from:
// // https://github.com/0xProject/0x.js/blob/development/packages/0x.js/src/utils/filter_utils.ts#L15
// const _abi = {
//   getMethodAbi: async (address, methodName, abi) => {
//     const methodAbi = _.find(abi, { name: methodName })
//     return methodAbi
//   },

//   getFilter: async (address, eventName, indexFilterValues, abi, blockRange) => {
//     let eventAbi
//     if (!eventName) {
//       const filter = {
//         address: address,
//         topics: [],
//       }
//       return {
//         ...blockRange,
//         ...filter,
//       }
//     } else {
//       eventAbi = _.find(abi, { name: eventName })
//     }
//     const eventString = _abi.getEventStringFromAbiName(eventAbi, eventName)
//     const eventSignature = utils.id(eventString)
//     const topicForEventSignature = utils.hexlify(eventSignature)
//     const topicsForIndexedArgs = _abi.getTopicsForIndexedArgs(eventAbi, indexFilterValues)
//     const topics = [topicForEventSignature, ...topicsForIndexedArgs]
//     let filter = {
//       address,
//       topics,
//     }
//     if (!_.isUndefined(blockRange)) {
//       filter = {
//         ...blockRange,
//         ...filter,
//       }
//     }
//     return filter
//   },

//   getEventStringFromAbiName: (eventAbi, eventName) => {
//     const types = _.map(eventAbi.inputs, 'type')
//     const signature = `${eventAbi.name}(${types.join(',')})`
//     return signature
//   },

//   getTopicsForIndexedArgs: (abi, indexFilterValues) => {
//     const topics = []
//     for (const eventInput of abi.inputs) {
//       if (!eventInput.indexed) {
//         continue
//       }
//       if (_.isUndefined(indexFilterValues[eventInput.name])) {
//         // Null is a wildcard topic in a JSON-RPC call
//         topics.push(null)
//       } else {
//         const value = indexFilterValues[eventInput.name]
//         topics.push(value)
//       }
//     }
//     return topics
//   },

//   matchesFilter(log, filter) {
//     if (!_.isUndefined(filter.address) && log.address !== filter.address) {
//       return false
//     }
//     if (!_.isUndefined(filter.topics)) {
//       return _abi.matchesTopics(log.topics, filter.topics)
//     }
//     return true
//   },

//   matchesTopics(logTopics, filterTopics) {
//     const matchesTopic = _.zipWith(logTopics, filterTopics, _abi.matchesTopic.bind(_abi))
//     const matchesTopics = _.every(matchesTopic)
//     return matchesTopics
//   },

//   matchesTopic(logTopic, filterTopic) {
//     if (_.isArray(filterTopic)) {
//       return _.includes(filterTopic, logTopic)
//     }
//     if (_.isString(filterTopic)) {
//       return filterTopic === logTopic
//     }
//     // null topic is a wildcard
//     return true
//   },
// }

// export default _abi
