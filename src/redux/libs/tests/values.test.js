import { isAddress, randInt, getListingHash } from '../values'

describe('libs: values', () => {
  test('should return a random integer between 10 and 50', () => {
    const result = randInt(10, 50)
    expect(result).toBeLessThanOrEqual(50)
    expect(result).toBeGreaterThanOrEqual(10)
  })

  test('should return a random integer between 10000 and 500000', () => {
    const result = randInt(10000, 500000)
    expect(result).toBeLessThanOrEqual(500000)
    expect(result).toBeGreaterThanOrEqual(10000)
  })

  test('should throw if given a value other than a number', () => {
    try {
      const result = randInt('20', 50)
    } catch (err) {
      expect(err.message).toBe('All args should have been numbers')
    }
    try {
      const result = randInt(20, '50')
    } catch (err) {
      expect(err.message).toBe('All args should have been numbers')
    }
  })

  describe('function: getListingHash', async () => {
    test('should return the correct keccak256 hash of a string', () => {
      const str = 'fool.com'
      const result = getListingHash(str)
      expect(result).toBe(
        '0xa3db3ddcd33ed6586d7c8d6c1d7837f0ce5e13e68583e0db809a94272abbecf6'
      )
      // https://github.com/AdChain/AdChainRegistryDapp/blob/master/src/services/registry.js#L109
    })
  })

  describe('function: isAddress', async () => {
    test('should return true if given a valid eth address', () => {
      const address = '0xD09cc3Bc67E4294c4A446d8e4a2934a921410eD7'
      const result = isAddress(address.toLowerCase())
      expect(result).toBe(true)
    })
  })
})
