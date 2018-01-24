import abi from 'ethereumjs-abi'
import Eth from 'ethjs'
import BigNumber from 'bignumber.js'

const BN = small => new Eth.BN(small.toString(10), 10)

const valUtils = {
  randInt: (min, max) => {
    if (max === undefined) {
      max = min
      min = 0
    }
    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new TypeError('All args should have been numbers')
    }
    return Math.floor(Math.random() * (max - min + 1) + min)
  },

  // returns the solidity-sha3 output for vote hashing
  getVoteSaltHash: (vote, salt) =>
    `0x${abi.soliditySHA3(['uint', 'uint'], [vote, salt]).toString('hex')}`,

  getListingHash: listing =>
    `0x${abi.soliditySHA3(['string'], [listing]).toString('hex')}`,

  // returns the solidity-sha3 output for VoteMap indexing
  getIndexHash: (account, pollID, atr) => {
    const hash = `0x${abi
      .soliditySHA3(['address', 'uint', 'string'], [account, pollID, atr])
      .toString('hex')}`
    return hash
  },

  getReceiptValue: (receipt, arg) => receipt.logs[0].args[arg],
  // returns poll instance
  getPoll: (voting, pollID) => voting.pollMap.call(pollID),
  getPollIDFromReceipt: receipt => valUtils.getReceiptValue(receipt, 'pollID'),
  getVotesFor: async (voting, pollID) => {
    const poll = await valUtils.getPoll(voting, pollID)
    return poll[3]
  },
  getUnstakedDeposit: async (registry, listingHash) => {
    // get the struct in the mapping
    const listing = await registry.listings.call(listingHash)
    // get the unstaked deposit amount from the listing struct
    const unstakedDeposit = await listing[3]
    return unstakedDeposit.toString()
  },

  divideAndGetWei: (numerator, denominator) => {
    const weiNumerator = Eth.toWei(BN(numerator), 'gwei')
    return weiNumerator.div(BN(denominator))
  },

  multiplyFromWei: (x, weiBN) => {
    if (!Eth.BN.isBN(weiBN)) {
      return false
    }
    const weiProduct = BN(x).mul(weiBN)
    return BN(Eth.fromWei(weiProduct, 'gwei'))
  },

  multiplyByPercentage: (x, y, z = 100) => {
    const weiQuotient = valUtils.divideAndGetWei(y, z)
    return valUtils.multiplyFromWei(x, weiQuotient)
  },

  // adapted from:
  // https://github.com/0xProject/0x.js/blob/development/packages/0x.js/src/utils/utils.ts#L68
  getCurrentUnixTimestampSec() {
    return new BigNumber(Date.now() / 1000).round()
  },
  getCurrentUnixTimestampMs() {
    return new BigNumber(Date.now())
  },
}

export default valUtils
