import contract from 'truffle-contract'
import Promise from 'bluebird'

import { toToken } from '../libs/units'

import abis from '../contracts'
import { getDefaults } from './defaults'
import { commonUtils } from '../sagas/utils';

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

  applyListing = async (listing, amount, tokenDecimalPower) => {
    // TODO: check to see that there's an allowance
    const gTokens = toToken(amount, tokenDecimalPower)
    return this.contract.apply(listing, gTokens.toString(10))
  }

  challengeListing = async (listing) => {
    const listingHash = commonUtils.getListingHash(listing)
    return this.contract.challenge(listingHash)
  }

  checkCall = async (fn, ...args) => {
    const result = await this.contract[fn](...args)
    console.log(fn, result)
    return result
  }

  updateStatus = async (listing) => {
    const listingHash = commonUtils.getListingHash(listing)
    const receipt = await this.contract.updateStatus(listingHash)
    console.log('updateStatus receipt:', receipt)
    return receipt
  }

  sendTx = (fn, ...args) => {
    this.contract[fn](...args)
  }

  filterListingAndCall = (dLogs, fn) =>
    this.asyncFilter(dLogs, this.contract[fn].call, 'listing')

  asyncFilter = (arr, fn, key) =>
    Promise.filter(arr, async (item, index) => fn(item[key]))
}
