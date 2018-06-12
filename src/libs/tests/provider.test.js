import {
  setProvider,
  getEthjs,
  getEthersProvider,
  setupSignerProvider,
} from '../provider'

describe('libs: provider', async () => {
  describe('function: setProvider', () => {
    test('should return ethjs provider at https://rinkeby.infura.io in test node_env', () => {
      const provider = setProvider()
      expect(provider.host).toBe('https://rinkeby.infura.io')
    })
  })

  describe('function: getEthjs', () => {
    test('should throw an error because ethjs is not yet defined', () => {
      expect(getEthjs).toThrowError('ethjs is undefined')
    })
  })

  describe('function: getEthersProvider', () => {
    test('should throw an error because ethersProvider is not yet defined', () => {
      expect(getEthersProvider).toThrowError('ethersProvider is undefined')
    })
  })

  describe('function: setupSignerProvider', () => {
    test('should return provider using NODE_ENV=test mnemonic', async () => {
      // const provider = setProvider(420)
      // const signerProvider = await setupSignerProvider(provider)
      // expect(signerProvider.address).toBe('0xD09cc3Bc67E4294c4A446d8e4a2934a921410eD7')
      // expect(signerProvider.mnemonic).toBe(process.env.MNEMONIC)
    })
  })
})
