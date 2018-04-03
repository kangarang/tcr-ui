import BNJS from 'bn.js'
import _ from 'lodash'

// TODO: typecheck
export const BN = small => {
  return new BNJS(small.toString(10), 10)
}
// Trim to 3 trailing decimals
export const trimDecimalsThree = n => {
  return (+n).toFixed(3).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')
}
// blockchain -> human
// 1,000,000.000,000,000 -> 1,000,000
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
export const convertedToBaseUnit = (amount, decimals) => {
  if (!_.isString(amount) && !_.isObject(amount) && !_.isNumber(amount)) {
    throw new Error('invalid type')
  }
  const decimalPower = BN(10).pow(BN(decimals))
  const baseUnit = BN(amount).mul(decimalPower)
  return baseUnit.toString(10)
}
