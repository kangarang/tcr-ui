import BNJS from 'bn.js'
import _ from 'lodash'

// TODO: typecheck
export const BN = small => {
  return new BNJS(small.toString(10), 10)
}
// Trim to 3 trailing decimals
export const trimDecimalsThree = n =>
  (+n).toFixed(3).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')
// Adds commas every 3 digits
export const withCommas = number => {
  let sides = []
  sides = number.toString().split('.')
  sides[0] = sides[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return sides.join('.')
}

// Random integer for salt
export const randInt = (min, max) => {
  if (max === undefined) {
    max = min
    min = 0
  }
  if (typeof min !== 'number' || typeof max !== 'number') {
    throw new TypeError('All args should have been numbers')
  }
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// blockchain -> human
// 1,000,000.000,000,000 -> 1,000,000
// in: string, BN, number
// out: string
export const baseToConvertedUnit = (amount, decimals) => {
  if (!_.isString(amount) && !_.isObject(amount) && !_.isNumber(amount)) {
    throw new Error('invalid type')
  }
  const decimalPower = BN(10).pow(BN(decimals))
  const convertedUnit = BN(amount).div(decimalPower)
  return convertedUnit.toString(10)
}
// human -> blockchain
// 1,000,000 -> 1,000,000,000,000,000
// in: string, BN, number
// out: string
export const convertedToBaseUnit = (amount, decimals) => {
  if (!_.isString(amount) && !_.isObject(amount) && !_.isNumber(amount)) {
    throw new Error('invalid type')
  }
  const decimalPower = BN(10).pow(BN(decimals))
  const baseUnit = BN(amount).mul(decimalPower)
  return baseUnit.toString(10)
}
