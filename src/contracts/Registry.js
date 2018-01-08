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

    this.contract = await RegistryContract.deployed()
    this.address = this.contract.address

    return this
  }

  applyDomain = async (domain, amount, tokenDecimalPower) => {
    // TODO: check to see that there's an allowance
    const gTokens = toToken(amount, tokenDecimalPower)
    return this.contract.apply(domain, gTokens.toString(10))
  }

  challengeDomain = async (domain) => this.contract.challenge(domain)

  checkCall = async (fn, ...args) => {
    const result = await this.contract[fn](...args)
    console.log(fn, result)
    return result
  }

  updateStatus = async (domain) => {
    const receipt = await this.contract.updateStatus(domain)
    console.log('updateStatus receipt:', receipt)
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
