import BNJS from 'bn.js'
// import ow from 'ow'

export const BN = small => {
  return new BNJS(small.toString(10), 10)
}

// Trim to 3 trailing decimals
export const trimDecimalsThree = n => {
  // ow(n, ow.string)

  return (+n).toFixed(3).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')
}

// blockchain -> human
// 1,000,000.000,000,000 -> 1,000,000
export const baseToConvertedUnit = (amount, decimals) => {
  // ow(amount, ow.any(ow.string, ow.number, ow.object))

  const decimalPower = BN('10').pow(BN(decimals.toString()))
  const convertedUnit = BN(amount.toString()).div(BN(decimalPower))
  // console.log('decimalPower, convertedUnit:', decimalPower, convertedUnit)
  return convertedUnit.toString()
}
// human -> blockchain
// 1,000,000 -> 1,000,000,000,000,000
export const convertedToBaseUnit = (amount, decimals) => {
  // ow(amount, ow.any(ow.string, ow.number, ow.object))

  const decimalPower = BN('10').pow(BN(decimals.toString()))
  const baseUnit = BN(amount).mul(decimalPower)
  // console.log('decimalPower, baseUnit:', decimalPower, baseUnit)
  return baseUnit.toString()
}
