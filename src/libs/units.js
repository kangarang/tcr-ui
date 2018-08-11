import BNJS from 'bn.js'

export const BN = small => {
  return new BNJS(small.toString(10), 10)
}

// Trim to 3 trailing decimals
export const trimDecimalsThree = n => {
  return (+n).toFixed(3).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')
}

const stripRightZeros = str => {
  const strippedStr = str.replace(/0+$/, '')
  return strippedStr === '' ? null : strippedStr
}

// blockchain -> human
// 1,000,000.000,000,000 -> 1,000,000
export const baseToConvertedUnit = (value, decimal) => {
  if (decimal === 0) {
    return value.toString()
  }
  const paddedValue = value.toString().padStart(decimal + 1, '0')
  const integerPart = value.toString().slice(0, -decimal)
  const fractionPart = stripRightZeros(paddedValue.slice(-decimal))
  return fractionPart ? `${integerPart}.${fractionPart}` : `${integerPart}`
}

// human -> blockchain
// 1,000,000 -> 1,000,000,000,000,000
export const convertedToBaseUnit = (value, decimal) => {
  // const decimalPower = BN('10').pow(BN(decimal.toString()))
  // const baseUnit = BN(value).mul(decimalPower)
  // return baseUnit.toString()

  if (decimal === 0) {
    return value
  }
  const [integerPart, fractionPart = ''] = value.split('.')
  const paddedFraction = fractionPart.padEnd(decimal, '0')
  return `${integerPart}${paddedFraction}`
}
