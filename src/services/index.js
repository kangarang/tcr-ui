import Registry from './Registry'
import Token from './Token'
import Parameterizer from './Parameterizer'
import Voting from './Voting'

const Contracts = {
  registry: false,
  token: {
    abi: Token,
    contract: false,
  },
  voting: {
    abi: Voting,
    contract: false,
  },
  parameterizer: {
    abi: Parameterizer,
    contract: false,
  },
}

export const setupRegistry = async (eth, account) => {
  Contracts.registry = await new Registry(eth, account)
  return Contracts.registry
}

export const getRegistry = async () => Contracts.registry

export const setupContract = (eth, account, c) => {
  Contracts[c] = new Contracts[c].abi(
    eth,
    account,
    Contracts.registry.contract,
  )
  return Contracts[c]
}

export const getContract = async (c) => Contracts[c]