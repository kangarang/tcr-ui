import ethers from 'ethers'

import abis from 'state/ducks/ethereumProvider/abis'

import { setupRegistry, setupContract } from '../contracts'
import { setProvider } from '../provider'

describe.skip('libs: contracts', async () => {
  describe('setupRegistry', () => {
    test('should return registry contract', async () => {
      const provider = setProvider(420)
      const abi = abis.registry.abi
      const address = abis.registry.networks[provider.chainId.toString()].address
      const registry = await setupRegistry(provider, abi, address)
    })
  })

  describe('setupContract', async () => {
    let registry

    beforeAll(async () => {
      const provider = setProvider(420)
      const abi = abis.registry.abi
      const address = abis.registry.networks[provider.chainId.toString()].address
      registry = await setupRegistry(provider, abi, address)
      expect(registry.address).toBe(address)
    })

    test('should return token contract', async () => {
      const token = await setupContract(registry.provider, abis.token.abi, registry, 'token')
    })

    test('should return voting contract', async () => {
      const voting = await setupContract(registry.provider, abis.voting.abi, registry, 'voting')
    })

    test('should return parameterizer contract', async () => {
      const parameterizer = await setupContract(
        registry.provider,
        abis.parameterizer.abi,
        registry,
        'parameterizer'
      )
    })
  })
})
