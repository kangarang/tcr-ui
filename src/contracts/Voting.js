import contract from 'truffle-contract'
import abi from 'ethereumjs-abi'

import abis from './abis'
import { getDefaults } from './defaults'

export default class Voting {
  constructor(eth, account, registry) {
    return this.setupVoting(eth, account, registry)
  }

  setupVoting = async (eth, account, registry) => {
    const PLCRVoting = contract(abis.PLCRVoting)
    PLCRVoting.setProvider(eth.currentProvider)
    PLCRVoting.defaults(getDefaults(account))

    this.address = await registry.voting.call()
    this.contract = await PLCRVoting.at(this.address)

    return this
  }

  createIndexHash = (account, pollID, atr) => {
    const hash = `0x${abi.soliditySHA3(['address', 'uint', 'string'],
      [account, pollID, atr]).toString('hex')}`;
    return hash;
  }

  commitVote = async (pollID, account, amount) => {
    const numTokens = amount
    const prevPollID = '0'
    const secretHash = this.createIndexHash(account, pollID, numTokens)
    console.log('secretHash', secretHash)

    const receipt = await this.contract.commitVote(pollID, secretHash, numTokens, prevPollID)
    return receipt
  }
}
