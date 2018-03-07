import abi from 'ethereumjs-abi'

const log = {
  getBlock: async (eth, hash) => eth.getBlockByHash(hash, false),
  getTransaction: async (eth, hash) => eth.getTransactionByHash(hash),
  getListingHash: listing =>
    `0x${abi.soliditySHA3(['string'], [listing]).toString('hex')}`,
}

export default log
