import contract from 'truffle-contract'

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

    if (typeof PLCRVoting.currentProvider.sendAsync !== "function") {
      PLCRVoting.currentProvider.sendAsync = function() {
        return PLCRVoting.currentProvider.send.apply(
          PLCRVoting.currentProvider, arguments
        )
      }
    }
    this.address = await registry.voting.call()
    this.contract = await PLCRVoting.at(this.address)

    return this
  }

  approveVoting = async () => {
    this.votingApproved = await this.token.approve(
      this.address,
      this.minDeposit
    )
  }

  commit = async () => this.contract.approve(this.address, this.minDeposit)

  reveal = async () => {}

  challengeDomain = async (domain) => {
    this.registry.challenge(domain, this.minDeposit)
  }
}
