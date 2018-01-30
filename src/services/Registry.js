import contract from 'truffle-contract'
import Promise from 'bluebird'

import abis from '../abis'
import { getDefaults } from './defaults'

export default class Registry {
  constructor(eth, account) {
    return this.setupRegistry(eth, account)
  }

  setupRegistry = async (eth, account) => {
    // const RegistryContract = eth.contract(abis.registry.abi, abis.registry.bytecode, {
    //   from: account,
    //   gas: 450000,
    //   gasPrice: 25000000000,
    // })

    // this.contract = await RegistryContract.at(abis.registry.networks[network].address)
    // this.address = this.contract.address
    // console.log('this.contract', this.contract)

    // return this

    // truffle-contract
    const RegistryContract = contract(abis.registry)
    RegistryContract.setProvider(eth.currentProvider)
    RegistryContract.defaults(getDefaults(account))
    // if (typeof RegistryContract.currentProvider.sendAsync !== 'function') {
      // RegistryContract.currentProvider.sendAsync = function() {
      //   return RegistryContract.currentProvider.send.apply(
      //     RegistryContract.currentProvider,
      //     arguments
      //   )
      // }
    // }

    this.contract = await RegistryContract.deployed()
    this.address = this.contract.address

    return this
  }

  filterListingAndCall = (dLogs, fn) =>
    this.asyncFilter(dLogs, this.contract[fn].call, 'listing')

  asyncFilter = (arr, fn, key) =>
    Promise.filter(arr, async (item, index) => fn(item[key]))
}
