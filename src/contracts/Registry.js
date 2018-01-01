import contract from 'truffle-contract'
import Promise from 'bluebird'

import { toToken } from '../libs/units'

import abis from './abis'

import { getDefaults } from './defaults'

export default class Registry {
  constructor(eth, account) {
    return this.setupRegistry(eth, account)
  }

  setupRegistry = async (eth, account) => {
    const RegistryContract = contract(abis.Registry)
    RegistryContract.setProvider(eth.currentProvider)
    RegistryContract.defaults(getDefaults(account))

    if (typeof RegistryContract.currentProvider.sendAsync !== "function") {
      RegistryContract.currentProvider.sendAsync = function() {
        return RegistryContract.currentProvider.send.apply(
          RegistryContract.currentProvider, arguments
        )
      }
    }
    this.contract = await RegistryContract.deployed()
    this.address = this.contract.address

    return this
  }

  applyDomain = async (domain, amount, tokenDecimalPower) => {
    // check to see that there's an allowance
    const gTokens = toToken(amount, tokenDecimalPower).toString(10)
    await this.contract.apply(domain, gTokens)
  }

  challengeDomain = async (domain) => {
    const { logs, receipt } = await this.contract.challenge(domain)
    const result = {
      blockHash: receipt.blockHash,
      blockNumber: receipt.blockNumber,
      txHash: receipt.transactionHash,
      txIndex: receipt.transactionIndex,
      event: logs[0].event,
      type: logs[0].type,
      contractAddress: logs[0].address,
      domain: logs[0].args.domain,
      deposit: logs[0].args.deposit.toString(10),
      pollID: logs[0].args.pollID.toString(10),
    }
    console.log('challenge receipt', result)
  }

  updateStatus = async (domain) => {
    const receipt = await this.contract.updateStatus(domain)
    return receipt
  }

  sendTx = (fn, ...args) => {
    this.contract[fn](...args)
  }

  filterDomainAndCall = (dLogs, fn) =>
    this.asyncFilter(dLogs, this.contract[fn].call, 'domain')

  asyncFilter = (arr, fn, key) =>
    Promise.filter(arr, async (item, index) => fn(item[key]))
}
