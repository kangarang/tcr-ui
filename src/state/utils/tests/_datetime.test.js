import moment from 'moment'
import { dateHasPassed, timestampToExpiry } from '../_datetime'

describe('datetime helpers', async () => {
  test('should return true for a small date', () => {
    const result = dateHasPassed(1)
    expect(result).toBe(true)
  })

  test('should return false for a massive date', () => {
    const result = dateHasPassed(126786147816748367128)
    expect(result).toBe(false)
  })

  test('should return the correct timestamp for the same date', () => {
    // prettier-ignore
    const now = moment().utc().unix()
    const converted = timestampToExpiry(now)
    expect(converted.timestamp).toBe(now)
  })

  test('should throw an error when given a string', () => {
    const converted = timestampToExpiry('123424')
    expect(converted.message).toBe('need integer!')
  })
})
