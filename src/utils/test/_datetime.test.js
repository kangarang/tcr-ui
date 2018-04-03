import moment from 'moment'
import { dateHasPassed, timestampToExpiryTimeLeft } from '../_datetime'

describe('datetime helpers', async () => {
  test('should return true for a small date', () => {
    const result = dateHasPassed(1)
    expect(result).toBe(true)
  })

  test('should return false for a massive date', () => {
    const result = dateHasPassed(126786147816748367128)
    expect(result).toBe(false)
  })

  test('should return zero for the same date', () => {
    const noww = moment()
      .utc()
      .unix() // 1520904331
    const converted = timestampToExpiryTimeLeft(noww)
    expect(converted.timeleft).toBe(0)
  })

  test('should throw an error when given a string', () => {
    const converted = timestampToExpiryTimeLeft('123424')
    expect(converted.message).toBe('need integer!')
  })
})
