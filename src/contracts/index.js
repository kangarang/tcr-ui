import Registry from './Registry'
import Token from './Token'
import Parameterizer from './Parameterizer'
import Voting from './Voting'

export const setupRegistry = async (eth, account) =>
  new Registry(
    eth,
    account,
  )

const contracts = {
  Token,
  Parameterizer,
  Voting,
}

export const setupContract = async (eth, account, registry, contract) =>
  new contracts[contract](
    eth,
    account,
    registry,
  )