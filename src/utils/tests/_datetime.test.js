import { dateHasPassed } from '../datetime'

describe('datetime helpers', async () => {
  test('should return true for a small date', () => {
    const result = dateHasPassed(1)
    expect(result).toBe(true)
  })

  test('should return false for a massive date', () => {
    const result = dateHasPassed(126786147816748367128)
    expect(result).toBe(false)
  })
})
