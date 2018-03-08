import contract from 'truffle-contract'

const getDefaults = account => ({
  from: account,
  gas: 300000,
  gasPrice: 25000000000,
})

export async function setupRegistry(eth, account, abi) {
  const Registry = contract(abi)
  Registry.setProvider(eth.currentProvider)
  Registry.defaults(getDefaults(account))

  return Registry.deployed()
}

export async function setupContract(eth, account, abi, registry, sc) {
  const Contract = contract(abi)
  Contract.setProvider(eth.currentProvider)
  Contract.defaults(getDefaults(account))

  const address = await registry[sc].call()
  return Contract.at(address)
}
