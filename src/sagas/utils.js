import EthAbi from 'ethjs-abi'
import abi from 'ethereumjs-abi'

// Logs helpers
export const logUtils = {
  getBlock: async (eth, hash) => eth.getBlockByHash(hash, false),
  getTransaction: async (eth, hash) => eth.getTransactionByHash(hash),

  getListingHash: (listing) => `0x${abi.soliditySHA3(['string'], [listing]).toString('hex')}`,

  canAnyBeWhitelisted: async (registry, logs) => registry.filterListingAndCall(logs, 'canBeWhitelisted'),

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
      numTokens: details.unstakedDeposit ? details.unstakedDeposit.toString(10) : false,
      event: details.eventName,
      logIndex: details.index.toString(10),
      pollID: details.pollID ? details.pollID.toString(10) : false
    }
  }),
}


// Event helpers (deprecated)
export const eventUtils = {
  setupEventSignatures: (contractABI) => {
    const events = {}
    contractABI.filter((method) => method.type === 'event').map((event) => {
      events[event.name] = EthAbi.encodeSignature(event)
      return event
    })
    return events
  },
}