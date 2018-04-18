import { setProvider, setupSignerProvider } from '../provider'

describe.skip('libs: provider', async () => {
  describe('function: setProvider', () => {
    test('should return default ethers.js provider', () => {
      const provider = setProvider(420)
      expect(provider.chainId).toBe(420)
    })
  })

  describe('function: setupSignerProvider', () => {
    test('should return provider using NODE_ENV=test mnemonic', async () => {
      const provider = setProvider(420)
      const signerProvider = await setupSignerProvider(provider)
      expect(signerProvider.address).toBe('0xD09cc3Bc67E4294c4A446d8e4a2934a921410eD7')
      expect(signerProvider.mnemonic).toBe(process.env.MNEMONIC)
    })
  })
})
