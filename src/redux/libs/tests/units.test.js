import BNJS from 'bn.js'
import {
  BN,
  baseToConvertedUnit,
  convertedToBaseUnit,
  trimDecimalsThree,
} from 'redux/libs/units'

describe('libs: units', () => {
  describe('unit conversion utils', async () => {
    test('should return the converted number as a string', () => {
      const converted = baseToConvertedUnit(50000000000000000000, 18)
      expect(converted).toBe('50')
    })

    test('should return the base unit as a string', () => {
      const base = convertedToBaseUnit(50, 18)
      expect(base).toBe('50000000000000000000')
    })

    test('baseToConvertedUnit should throw if given undefined', () => {
      try {
        baseToConvertedUnit(undefined, 18)
      } catch (error) {
        expect(error.message).toBe('invalid type')
      }
    })

    test('convertedToBaseUnit should throw if given undefined', () => {
      try {
        convertedToBaseUnit(undefined, 18)
      } catch (error) {
        expect(error.message).toBe('invalid type')
      }
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

    test('should throw if given an object', () => {
      try {
        const obj = {
          key: 'value',
        }
        BN(obj)
      } catch (err) {
        expect(err.message).toBe('invalid type')
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

    test('should throw if given a type other than string', () => {
      try {
        trimDecimalsThree(3542531322.32134143432)
      } catch (err) {
        expect(err.message).toBe('invalid type; expected string')
      }
    })
  })
})
