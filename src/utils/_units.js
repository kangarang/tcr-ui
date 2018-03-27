import BNJS from 'bn.js'
import _ from 'lodash'

// TODO: typecheck
export const BN = small => {
  return new BNJS(small.toString(10), 10)
}

// blockchain -> human
// 1,000,000.000,000,000 -> 1,000,000
// in: string, BN, number
// out: string
// aka: baseUnitsToTokens
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
// aka: tokensToBaseUnits
export const convertedToBaseUnit = (amount, decimals) => {
  if (!_.isString(amount) && !_.isObject(amount) && !_.isNumber(amount)) {
    throw new Error('invalid type')
  }
  const decimalPower = BN(10).pow(BN(decimals))
  const baseUnit = BN(amount).mul(decimalPower)
  return baseUnit.toString(10)
}
