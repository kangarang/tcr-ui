import { baseToConvertedUnit, convertedToBaseUnit } from 'state/libs/units'

describe('libs: units', () => {
  test('should return the converted number as a string', () => {
    const converted = baseToConvertedUnit(50000000000000000000, 18)
    expect(converted).toBe('50')
  })

  test('should return the base unit as a string', () => {
    const base = convertedToBaseUnit(50, 18)
    expect(base).toBe('50000000000000000000')
  })

  describe('input type checking / error handling', async () => {
    test('baseToConvertedUnit', () => {
      try {
        baseToConvertedUnit(undefined, 18)
      } catch (error) {
        expect(error.message).toBe('invalid type')
      }
    })

    test('convertedToBaseUnit', () => {
      try {
        convertedToBaseUnit(undefined, 18)
      } catch (error) {
        expect(error.message).toBe('invalid type')
      }
    })
  })
})
