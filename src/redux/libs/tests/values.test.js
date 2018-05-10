import { isAddress, randomSalt, getListingHash } from '../values'
import { BN } from '../units'

describe('libs: values', () => {
  test('should return a random integer', () => {
    const result = randomSalt()
    const biggestNumber = BN('2').pow(BN('256'))

    const actual = BN(result).lte(biggestNumber)
    const expected = true
    expect(actual).toBe(expected)
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
