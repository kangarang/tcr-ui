import contract from 'truffle-contract'
import Promise from 'bluebird'

// import { toToken } from '../libs/units'

import abis from '../contracts'
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

  applyListing = async (listing, amount, tokenDecimalPower) => {
    // For tokens with decimals...
    // const gTokens = toToken(amount, tokenDecimalPower)
    // return this.contract.apply(listing, gTokens.toString(10))

    // TODO: check to see that there's an allowance
    return this.contract.apply(listing, amount)
  }

  filterListingAndCall = (dLogs, fn) =>
    this.asyncFilter(dLogs, this.contract[fn].call, 'listing')

  asyncFilter = (arr, fn, key) =>
    Promise.filter(arr, async (item, index) => fn(item[key]))
}
