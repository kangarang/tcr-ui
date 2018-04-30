import isString from 'lodash/fp/isString'
import isNumber from 'lodash/fp/isNumber'
import isObject from 'lodash/fp/isObject'
import BNJS from 'bn.js'

export const BN = small => {
  if (BNJS.isBN(small)) {
    return small
  }
  if (isString(small)) {
    return new BNJS(small, 10)
  }
  if (isNumber(small)) {
    return new BNJS(small.toString(10), 10)
  }
  throw new TypeError('invalid type')
}

// Trim to 3 trailing decimals
export const trimDecimalsThree = n => {
  if (!isString(n)) {
    throw new Error('invalid type; expected string')
  }
  return (+n).toFixed(3).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')
}

// blockchain -> human
// 1,000,000.000,000,000 -> 1,000,000
export const baseToConvertedUnit = (amount, decimals) => {
  if (!isString(amount) && !isObject(amount) && !isNumber(amount)) {
    throw new Error('invalid type')
  }
  const decimalPower = BN(10).pow(BN(decimals))
  const convertedUnit = BN(amount).div(decimalPower)
  return convertedUnit.toString(10)
}
// human -> blockchain
// 1,000,000 -> 1,000,000,000,000,000
export const convertedToBaseUnit = (amount, decimals) => {
  if (!isString(amount) && !isObject(amount) && !isNumber(amount)) {
    throw new Error('invalid type')
  }
  const decimalPower = BN(10).pow(BN(decimals))
  const baseUnit = BN(amount).mul(decimalPower)
  return baseUnit.toString(10)
}
