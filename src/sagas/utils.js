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

  canAnyBeWhitelisted: async (registry, logs) => registry.filterDomainAndCall(logs, 'canBeWhitelisted'),
}

// Common helpers
export const commonUtils = {
  getBlock: async (eth, hash) => eth.getBlockByHash(hash, false),
  getTransaction: async (eth, hash) => eth.getTransactionByHash(hash),

  isWhitelisted: async (registry, domain) => registry.contract.isWhitelisted.call(domain),
  canBeWhitelisted: async (registry, domain) => registry.contract.canBeWhitelisted.call(domain),

  shapeShift: (b, tx, details) => ({
    domain: details.domain,
    owner: details.eventName === '_Application' && tx.from,
    challenger: details.pollID && details.challenger,
    latest: {
      whitelisted: details.isWhitelisted,
      canBeWhitelisted: details.canBeWhitelisted,
      blockHash: b.hash,
      blockNumber: b.number.toString(10),
      timestamp: b.timestamp && new Date(b.timestamp.toNumber(10)),
      txHash: tx.hash,
      txIndex: tx.index.toString(10),
      sender: tx.from,
      numTokens: details.unstakedDeposit ? details.unstakedDeposit.toString(10) : false,
      event: details.eventName,
      logIndex: details.index.toString(10),
      pollID: details.pollID ? details.pollID.toString(10) : false
    }
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
  },
}