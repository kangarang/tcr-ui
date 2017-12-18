import Registry from './Registry'
import Token from './Token'
import Parameterizer from './Parameterizer'
import Voting from './Voting'

export const setupRegistry = async (eth, account) => {
  const registry = await new Registry(
    eth,
    account,
  )

  return registry
}

export const setupContracts = async (eth, account, registry) => {
  const token = await new Token(
    eth,
    account,
    registry,
  )

  const parameterizer = await new Parameterizer(
    eth,
    account,
    registry,
  )

  const voting = await new Voting(
    eth,
    account,
    registry,
  )

  return {
    token, parameterizer, voting,
  }
}