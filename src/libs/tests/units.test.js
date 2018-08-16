import BNJS from 'bn.js'
import { BN, fromTokenBase, toTokenBase, trimDecimalsThree } from 'libs/units'

describe('libs: units', () => {
  describe('unit conversion utils', async () => {
    describe('function: toTokenBase', () => {
      test('should convert to the base unit value', () => {
        const actual = toTokenBase(BN('6758436257'), '18')
        const expected = '6758436257000000000000000000'
        expect(actual.toString()).toBe(expected)

        const actual2 = toTokenBase(BN('420'), '18')
        const expected2 = '420000000000000000000'
        expect(actual2.toString()).toBe(expected2)
      })

      test('should return the base unit as a string', () => {
        const base = toTokenBase(50, 18)
        expect(base.toString()).toBe('50000000000000000000')
      })
    })

    describe('function: fromTokenBase', () => {
      test('should return the converted unit value', () => {
        const actual = fromTokenBase('67584362578349625784362578', '18')
        const expected = '67584362.578349625784362578'
        expect(actual.toString()).toBe(expected)

        const actual2 = fromTokenBase(BN('420000000000000000000'), '18')
        const expected2 = '420'
        expect(actual2.toString()).toBe(expected2)
      })

      test('should return the converted number as a string', () => {
        const converted = fromTokenBase(50000000000000000000, 18)
        expect(converted.toString()).toBe('50')
      })
    })
  })

  describe('function: BN', () => {
    test('should return the BN if given a BN', async () => {
      const bigNum = new BNJS('900000000000')
      const res = BN(bigNum)
      expect(res).toEqual(bigNum)
    })

    test('should throw if given a number w/ decimals', async () => {
      const nonNum = '0.34'
      const two = '9.42671'
      const three = '4213.471'
      const four = '0.4'
      try {
        BN(nonNum)
        BN(two)
        BN(three)
        BN(four)
      } catch (error) {
        expect(error.message).toBe('No decimals')
      }
    })
  })

  describe('function: trimDecimalsThree', () => {
    test('should return the same number if less than 3 decimal places', () => {
      const actual = trimDecimalsThree('43444492.29')
      const expected = '43444492.29'
      expect(actual).toBe(expected)
    })

    test('should trim a number with more than 3 decimal places', () => {
      const actual = trimDecimalsThree('43444492.849384902384')
      const expected = '43444492.849'
      expect(actual).toBe(expected)
    })
  })
})
