import contract from 'truffle-contract'
import abi from 'ethereumjs-abi'
import FileSaver from 'file-saver'
import moment from 'moment'

import abis from '../contracts'
import { getDefaults } from './defaults'
import valUtils from '../libs/values'

export default class Voting {
  constructor(eth, account, registry) {
    return this.setupVoting(eth, account, registry)
  }

  setupVoting = async (eth, account, registry) => {
    const VotingContract = contract(abis.PLCRVoting)
    VotingContract.setProvider(eth.currentProvider)
    VotingContract.defaults(getDefaults(account))

    this.address = await registry.voting.call()
    this.contract = await VotingContract.at(this.address)

    return this
  }

  requestVotingRights = async votingRights =>
    this.contract.requestVotingRights(votingRights)

  commitVote = async (pollID, account, numTokens) => {
    const prevPollID = await this.contract.getInsertPointForNumTokens.call(
      account,
      numTokens
    )
    const salt = valUtils.randInt(1e6, 1e8)
    console.log('salt', salt)
    // const secretHash = valUtils.getVoteSaltHash(vote, salt)
    // console.log('secretHash', secretHash)
    // console.log('pollID', pollID)
    // console.log('numTokens', numTokens)

    // const receipt = await this.contract.commitVote(
    //   pollID,
    //   secretHash,
    //   numTokens,
    //   prevPollID
    // )
    // console.log('receipt', receipt)
    // return receipt
  }
}
