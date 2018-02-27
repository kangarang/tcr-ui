import abi from 'ethereumjs-abi'

const log_utils = {
  getBlock: async (eth, hash) => eth.getBlockByHash(hash, false),
  getTransaction: async (eth, hash) => eth.getTransactionByHash(hash),

  getListingHash: listing =>
    `0x${abi.soliditySHA3(['string'], [listing]).toString('hex')}`,

  canAnyBeWhitelisted: async (registry, logs) =>
    registry.filterListingAndCall(logs, 'canBeWhitelisted'),

  normalizr: () => {
    // const normal = {
    //   timestamp: 1511390492,
    //   transactionHash:
    //     '0x173543d440410544b81d7ebeddd1f40f651ef8e8606fa8dcac7ab579d8e33087',
    //   tokenInfo: {
    //     address: '0x688f95e3416b3960a2bbcc1d25a2c17aff9aefc6',
    //     name: 'TurkeyCoin',
    //     decimals: '18',
    //     symbol: 'TRKY',
    //     totalSupply: '1000000000000000000000',
    //     owner: '0x',
    //     txsCount: 3,
    //     transfersCount: 15,
    //     lastUpdated: 1511505832,
    //     issuancesCount: 0,
    //     holdersCount: 12,
    //     price: false,
    //   },
    //   type: 'transfer',
    //   value: '100000000000000000',
    //   from: '0x4b8ea56773822a393d38019e799bfc25229284b2',
    //   to: '0x6c439e156c0571b9e9174c4ac440018515dea1f4',
    // }
  },

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

      timestamp: block.timestamp && new Date(block.timestamp.toNumber(10)),
    },
  }),

}

export default log_utils 