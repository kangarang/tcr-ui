// import contract from 'truffle-contract'
import abi from 'ethereumjs-abi'

import abis from './abis'
import { toNineToken } from '../libs/units';

export default class Voting {
  constructor(eth, account, registry) {
    return this.setupVoting(eth, account, registry)
  }

  setupVoting = async (eth, account, registry) => {
    const PLCRVoting = eth.contract(abis.PLCRVoting.abi, abis.PLCRVoting.bytecode, {
      from: account,
      gas: 450000,
      gasPrice: 25000000000,
    })

    this.address = (await registry.voting.call())['0']
    this.contract = await PLCRVoting.at(this.address)

    return this
  }

  createIndexHash = (account, pollID, atr) => {
    const hash = `0x${abi.soliditySHA3(['address', 'uint', 'string'],
      [account, pollID, atr]).toString('hex')}`;
    return hash;
  }

  requestVotingRights = (votingRights) =>
    this.contract.requestVotingRights(toNineToken(votingRights).toString(10))

  commitVote = async (pollID, account, numTokens) => {
    const prevPollID = (await this.contract.getInsertPointForNumTokens.call(account, numTokens))['0']
    const secretHash = this.createIndexHash(account, pollID, numTokens)
    console.log('secretHash', secretHash)
    console.log('pollID', pollID)
    console.log('numTokens', numTokens)

    const receipt = (await this.contract.commitVote(pollID, secretHash, numTokens, prevPollID))['0']
    console.log('receipt', receipt)
    return receipt
  }
}
