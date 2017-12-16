import contract from 'truffle-contract'

import ABIS from './abis'

function getDefaults(account) {
  return {
    from: account,
    gas: 400000,
    gasPrice: 25000000000,
  }
}

class ContractFactory {
  constructor(eth, account, registry) {
    return this.initContract(eth, account, registry)
  }

  initContract = async (c, type, eth, account, registry) => {
    const Contract = contract(ABIS[c])
    Contract.setProvider(eth.currentProvider)
    Contract.defaults(getDefaults(account))

    this.address = await registry[type].call()
    this.contract = await Contract.at(this.address)
    return this
  }
}

const ContractFactoryInit = new ContractFactory()

export default ContractFactoryInit
