import abi from 'ethereumjs-abi'

const log_utils = {
  getBlock: async (eth, hash) => eth.getBlockByHash(hash, false),
  getTransaction: async (eth, hash) => eth.getTransactionByHash(hash),

  getListingHash: listing =>
    `0x${abi.soliditySHA3(['string'], [listing]).toString('hex')}`,

  canAnyBeWhitelisted: async (registry, logs) =>
    registry.filterListingAndCall(logs, 'canBeWhitelisted'),

  shapeShift: (block, tx, details) => ({
    listingString: details.listingString,
    listingHash: details.listingHash,
    owner: tx.from,
    challenger: details.pollID && details.challenger,
    latest: {
      whitelisted: details.isWhitelisted,
      canBeWhitelisted: details.canBeWhitelisted,
      blockHash: details.blockHash,
      blockNumber: details.blockNumber,
      txHash: tx.hash,
      txIndex: tx.index.toString(10),
      logIndex: details.index.toString(10),
      pollID: details.pollID ? details.pollID.toString(10) : false,

      sender: tx.from,
      numTokens: details.unstakedDeposit
        ? details.unstakedDeposit.toString(10)
        : false,
      event: details.eventName,

      appExpiry: details.appExpiry,
      appExpired: details.appExpired,
      commitEndDate: details.commitEndDate,
      commitExpiry: details.commitExpiry,
      revealEndDate: details.revealEndDate,
      revealExpiry: details.revealExpiry,
      rewardPool: details.rewardPool,
      challenger: details.challenger,
      resolved: details.resolved,
      stake: details.stake,
      totalTokens: details.totalTokens,

      timestamp: block.timestamp && new Date(block.timestamp.toNumber(10)),
    },
  }),

}

export default log_utils 