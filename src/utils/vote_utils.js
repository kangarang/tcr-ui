import moment from 'moment'
import saveFile from '../utils/file_utils'
import valUtils from '../libs/values'

export const voteUtils = {
  commitVote: async (plcr, pollID, voteOption, account, numTokens) => {
    const prevPollID = await plcr.getInsertPointForNumTokens.call(
      account,
      numTokens
    )
    const salt = valUtils.randInt(1e6, 1e8)
    console.log('salt', salt)
    const secretHash = valUtils.getVoteSaltHash(voteOption, salt)
    console.log('secretHash', secretHash)
    console.log('pollID', pollID)
    console.log('numTokens', numTokens)
    
    const receipt = await plcr.commitVote(
      pollID,
      secretHash,
      numTokens,
      prevPollID
    )
    console.log('receipt', receipt)
    return receipt
  },
}