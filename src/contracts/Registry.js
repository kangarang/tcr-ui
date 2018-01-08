import Promise from 'bluebird'

import { toToken } from '../libs/units'

import abis from './abis'

export default class Registry {
  constructor(eth, account) {
    return this.setupRegistry(eth, account)
  }

  setupRegistry = async (eth, account) => {
    const RegistryContract = eth.contract(abis.Registry.abi, abis.Registry.bytecode, {
      from: account,
      gas: 450000,
      gasPrice: 25000000000,
    })

    this.contract = await RegistryContract.at(abis.Registry.networks['420'].address)
    this.address = this.contract.address

    return this
  }

  applyDomain = async (domain, amount, tokenDecimalPower) => {
    // TODO: check to see that there's an allowance
    const gTokens = toToken(amount, tokenDecimalPower)
    return this.contract.apply(domain, gTokens)
  }

  challengeDomain = async (domain) => this.contract.challenge(domain)

  checkCall = async (fn, ...args) => {
    const result = await this.contract[fn](...args)
    console.log(fn, result)
    return result['0']
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
