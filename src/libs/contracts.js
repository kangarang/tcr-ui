import contract from 'truffle-contract'
// import Promise from 'bluebird'
import abis from '../abis'

const getDefaults = account => ({
  from: account,
  gas: 300000,
  gasPrice: 25000000000,
})

class Registry {
  constructor(eth, account) {
    return this.init(eth, account)
  }
  init = async (eth, account) => {
    const RegistryContract = contract(abis.registry)
    RegistryContract.setProvider(eth.currentProvider)
    RegistryContract.defaults(getDefaults(account))
    this.contract = await RegistryContract.deployed()
    this.address = this.contract.address
    return this
  }
  // filterListingAndCall = (dLogs, fn) =>
  //   this.asyncFilter(dLogs, this.contract[fn].call, 'listing')
  // asyncFilter = (arr, fn, key) =>
  //   Promise.filter(arr, async (item, index) => fn(item[key]))
}

class ContractFactory {
  constructor(eth, account, registry, c) {
    return this.init(eth, account, registry, c)
  }
  init = async (eth, account, registry, c) => {
    const Contract = contract(abis[c])
    Contract.setProvider(eth.currentProvider)
    Contract.defaults(getDefaults(account))

    this.address = await registry[c].call()
    this.contract = await Contract.at(this.address)
    return this
  }
}

export const setupRegistry = async (eth, account) => new Registry(eth, account)

export const setupContract = async (eth, account, reg, c) =>
  new ContractFactory(eth, account, reg, c)
