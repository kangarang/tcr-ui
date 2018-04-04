import { baseToConvertedUnit, convertedToBaseUnit } from 'libs/units'

describe('unit conversion helpers', () => {
  test('should return the converted number as a string', () => {
    const converted = baseToConvertedUnit(50000000000000000000, 18)
    expect(converted).toBe('50')
  })

  test('should return the base unit as a string', () => {
    const base = convertedToBaseUnit(50, 18)
    expect(base).toBe('50000000000000000000')
  })

  test('should throw an error if input is undefined', () => {
    try {
      baseToConvertedUnit(undefined, 18)
    } catch (error) {
      expect(error.message).toBe('invalid type')
    }
  })

  test('should throw an error if input is undefined 2', () => {
    try {
      convertedToBaseUnit(undefined, 18)
    } catch (error) {
      expect(error.message).toBe('invalid type')
    }
  })
})
