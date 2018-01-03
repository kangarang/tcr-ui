import Eth from 'ethjs'
import EthAbi from 'ethjs-abi'

import topics from '../libs/topics'

// Logs helpers
export const logUtils = {
  buildFilter: (address, topic) => ({
    fromBlock: new Eth.BN('1'),
    toBlock: 'latest',
    address,
    topics: topics[topic],
  }),

  decodeLogs: async (eth, contract, rawLogs) => {
    const decoder = EthAbi.logDecoder(contract.abi)
    return decoder(rawLogs)
  },

  canBeWhitelisted: async (registry, logs) => registry.filterDomainAndCall(logs, 'canBeWhitelisted'),

}

// Common helpers
export const commonUtils = {
  getBlock: async (eth, hash) => eth.getBlockByHash(hash, false),
  getTransaction: async (eth, hash) => eth.getTransactionByHash(hash),

  isWhitelisted: async (registry, domain) => registry.contract.isWhitelisted.call(domain),
  canBeWhitelisted: async (registry, domain) => registry.contract.canBeWhitelisted.call(domain),

  shapeShift: (block, transaction, details) => ({
    blockNumber: block.number.toString(10),
    blockHash: block.hash,
    timestamp: block.timestamp && new Date(block.timestamp.toNumber(10)),

    txHash: transaction.hash,
    txIndex: transaction.index.toString(10),
    from: transaction.from,
    to: transaction.to,

    domain: details.domain,
    unstakedDeposit: details.unstakedDeposit ? details.unstakedDeposit.toString(10) : false,
    pollID: details.pollID ? details.pollID.toString(10) : false,
    logIndex: details.index.toString(10),

    event: details.eventName,
    contractAddress: details.contractAddress,
    status: details.status,
    whitelisted: details.isWhitelisted,
  }),
}

// Event helpers
export const eventUtils = {
  checkForWhitelist: (item) => {
    switch (item.event) {
      case '_NewDomainWhitelisted' || '_ChallengeFailed':
        return true
      case '_Application' || '_Challenge' || '_ChallengeSucceeded':
        return false
      default:
        return false
    }
  },
  setupEventSignatures: (contractABI) => {
    const events = {}
    contractABI.filter((method) => method.type === 'event').map((event) => {
      events[event.name] = EthAbi.encodeSignature(event)
      return event
    })
    return events
  }
}