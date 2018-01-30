import Registry from './Registry'
import Token from './ContractFactory'
import Parameterizer from './ContractFactory'
import Voting from './ContractFactory'

export const Contracts = {
  registry: Registry,
  token: Token,
  voting: Voting,
  parameterizer: Parameterizer,
}

export const setupRegistry = async (eth, account) => {
  Contracts.registry = await new Contracts.registry(eth, account)
  return Contracts.registry
}
export const setupContract = async (eth, account, registry, c) => {
  Contracts[c] = await new Contracts[c](
    eth,
    account,
    registry.contract,
    c,
  )
  return Contracts[c]
}

export const getRegistry = () => Contracts.registry
export const getContract = (c) => Contracts[c]