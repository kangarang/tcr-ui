import { getProvider, getEthjs, getEthersProvider } from '../provider'

describe('libs: provider', async () => {
  describe('function: getProvider', () => {
    test('should return ethjs provider at https://rinkeby.infura.io in test node_env', () => {
      const provider = getProvider()
      expect(provider.host).toBe('https://rinkeby.infura.io')
    })
  })
})
