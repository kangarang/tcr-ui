import EthContract from 'ethjs-contract'
import { getEthjs } from 'libs/provider'
// import { getGasPrice } from 'libs/gas'

export async function setupRegistry(abi, bytecode, from, address) {
  const ethjs = getEthjs()
  const contract = new EthContract(ethjs)

  const Registry = contract(abi, bytecode, { from, gas: 2000000 })
  return Registry.at(address)
}

export async function setupContract(abi, bytecode, from, registry, sc) {
  const ethjs = getEthjs()
  const contract = new EthContract(ethjs)

  const address = (await registry[sc]())['0']
  const Contract = contract(abi, bytecode, { from, gas: 2000000 })
  return Contract.at(address)
}
