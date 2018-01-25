import contract from 'truffle-contract'
import Promise from 'bluebird'

import abis from '../contracts'
import { getDefaults } from './defaults'

export default class Registry {
  constructor(eth, account) {
    return this.setupRegistry(eth, account)
  }

  setupRegistry = async (eth, account) => {
    const RegistryContract = contract(abis.registry)
    RegistryContract.setProvider(eth.currentProvider)
    RegistryContract.defaults(getDefaults(account))

    this.contract = await RegistryContract.deployed()
    this.address = this.contract.address

    return this
  }

  filterListingAndCall = (dLogs, fn) =>
    this.asyncFilter(dLogs, this.contract[fn].call, 'listing')

  asyncFilter = (arr, fn, key) =>
    Promise.filter(arr, async (item, index) => fn(item[key]))
}
