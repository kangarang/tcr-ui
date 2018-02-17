import abi from 'ethereumjs-abi'
import moment from 'moment'
import { saveFile } from './file_utils'
import { randInt } from './units_utils'

const vote_utils = {
  getEndDateString: integer =>
    moment.unix(integer).format('YYYY-MM-DD_HH-mm-ss'),

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

  getUnstakedDeposit: async (registry, listingHash) => {
    // get the struct in the mapping
    const listing = await registry.listings.call(listingHash)
    // get the unstaked deposit amount from the listing struct
    const unstakedDeposit = await listing[3]
    return unstakedDeposit.toString()
  },

  getReceiptValue: (receipt, arg) => receipt.logs[0].args[arg],

  getPollIDFromReceipt: receipt =>
    vote_utils.getReceiptValue(receipt, 'pollID'),

  getPoll: (voting, pollID) => voting.pollMap.call(pollID),

  getVotesFor: async (voting, pollID) => {
    const poll = await vote_utils.getPoll(voting, pollID)
    return poll[3]
  },
}

export default vote_utils
