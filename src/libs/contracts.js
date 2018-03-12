import contract from 'truffle-contract'

const getDefaults = account => ({
  from: account,
  gas: 300000,
  gasPrice: 25000000000,
})

export async function setupRegistry(provider, account, abi, address) {
  const Registry = contract(abi)
  Registry.setProvider(provider)
  Registry.defaults(getDefaults(account))

  return Registry.at(address)
}

export async function setupContract(provider, account, abi, registry, sc) {
  const Contract = contract(abi)
  Contract.setProvider(provider)
  Contract.defaults(getDefaults(account))

  const address = await registry[sc].call()
  return Contract.at(address)
}
