// import Registry from '../contracts/Registry.json'
// import Token from '../contracts/EIP20.json'
// import Parameterizer from '../contracts/Parameterizer.json'
// import Voting from '../contracts/PLCRVoting.json'

import Registry from './Registry'
import Token from './Token'
import Parameterizer from './Parameterizer'
import Voting from './Voting'

const Contracts = {
  registry: false,
  token: Token,
  voting: Voting,
  parameterizer: Parameterizer,
}

export const setupRegistry = async (eth, account) => {
  Contracts.registry = await new Registry(eth, account)
  return Contracts.registry
}

export const getRegistry = () => Contracts.registry

export const setupContract = async (eth, account, c) => {
  Contracts[c] = await new Contracts[c](
    eth,
    account,
    Contracts.registry.contract,
  )
  return Contracts[c]
}

export const getContract = (c) => Contracts[c]