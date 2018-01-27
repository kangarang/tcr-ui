import abi from 'ethereumjs-abi'
import moment from 'moment'
import saveFile from './file_utils'
import value_utils from './value_utils'

const vote_utils = {
  getEndDateString: (endDate) => moment.unix(endDate).format('YYYY-MM-DD_HH-mm-ss'),

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
  getPollIDFromReceipt: receipt => vote_utils.getReceiptValue(receipt, 'pollID'),
  getPoll: (voting, pollID) => voting.pollMap.call(pollID),
  getVotesFor: async (voting, pollID) => {
    const poll = await vote_utils.getPoll(voting, pollID)
    return poll[3]
  },

  commitVote: async (plcr, pollID, voteOption, account, numTokens, listing) => {
    const prevPollID = await plcr.getInsertPointForNumTokens.call(
      account,
      numTokens
    )
    const salt = value_utils.randInt(1e6, 1e8)
    const secretHash = vote_utils.getVoteSaltHash(voteOption, salt)

    const pollStruct = await plcr.pollMap.call(pollID)

    const commitEndDateString = vote_utils.getEndDateString(pollStruct[0])
    const revealEndDateString = vote_utils.getEndDateString(pollStruct[1])

    const json = {
      listing,
      voteOption,
      salt: salt.toString(10),
      pollID,
      pollStruct,
      commitEndDateString,
      revealEndDateString,
      secretHash,
    }

    const listingUnderscored = listing.replace('.', '_')
    const filename = `${listingUnderscored}--pollID_${pollID}--commitEnd_${commitEndDateString}--commitVote.json`

    
    const receipt = await plcr.commitVote(
      pollID,
      secretHash,
      numTokens,
      prevPollID
    )

    if (receipt.receipt.status !== '0x0') {
      saveFile(json, filename)
      return receipt
    }
    return false
  },
}
export default vote_utils 