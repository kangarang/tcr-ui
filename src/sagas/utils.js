import Eth from 'ethjs'
import EthAbi from 'ethjs-abi'
import abi from 'ethereumjs-abi'
import topics from '../libs/topics'

// Logs helpers
export const logUtils = {
  buildFilter: (address, topic, sb, eb) => ({
    fromBlock: new Eth.BN(sb),
    toBlock: eb,
    address,
    topics: topics[topic],
  }),

  decodeLogs: async (eth, contract, rawLogs) => {
    // TODO: instantiate only once
    const decoder = EthAbi.logDecoder(contract.abi)
    return decoder(rawLogs)
  },

  canAnyBeWhitelisted: async (registry, logs) => registry.filterListingAndCall(logs, 'canBeWhitelisted'),
}


// Common helpers
export const commonUtils = {
  getBlock: async (eth, hash) => eth.getBlockByHash(hash, false),
  getTransaction: async (eth, hash) => eth.getTransactionByHash(hash),

  isWhitelisted: async (registry, listingHash) => registry.contract.isWhitelisted.call(listingHash),
  canBeWhitelisted: async (registry, listingHash) => registry.contract.canBeWhitelisted.call(listingHash),

  getListingHash: (listing) => `0x${abi.soliditySHA3(['string'], [listing]).toString('hex')}`,

  shapeShift: (b, tx, details) => ({
    listing: details.listing,
    listingHash: details.listingHash,
    owner: tx.from,
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






// Event helpers (deprecated)
export const eventUtils = {
  checkForWhitelist: (item) => {
    switch (item.event) {
      case '_NewListingWhitelisted' || '_ChallengeFailed':
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