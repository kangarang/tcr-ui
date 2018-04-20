import EthContract from 'ethjs-contract'
import { getEthjs } from 'state/libs/provider'

const getDefaults = account => ({
  from: account,
  gas: 300000,
  gasPrice: 25000000000,
})

export async function setupRegistry(abi, bytecode, account, address) {
  const ethjs = getEthjs()
  const contract = new EthContract(ethjs)

  const Registry = contract(abi, bytecode, getDefaults(account))
  return Registry.at(address)
}

export async function setupContract(abi, bytecode, account, registry, sc) {
  const ethjs = getEthjs()
  const contract = new EthContract(ethjs)

  const address = (await registry[sc]())['0']
  const Contract = contract(abi, bytecode, getDefaults(account))
  return Contract.at(address)
}
