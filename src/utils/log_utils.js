import abi from 'ethereumjs-abi'

const log_utils = {
  getBlock: async (eth, hash) => eth.getBlockByHash(hash, false),
  getTransaction: async (eth, hash) => eth.getTransactionByHash(hash),

  getListingHash: listing =>
    `0x${abi.soliditySHA3(['string'], [listing]).toString('hex')}`,

  canAnyBeWhitelisted: async (registry, logs) =>
    registry.filterListingAndCall(logs, 'canBeWhitelisted'),
}

export default log_utils 