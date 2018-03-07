import Eth from 'ethjs'
// import bs58 from 'bs58'
import _ from 'lodash'

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

export const BN = small => new Eth.BN(small.toString(10), 10)
// Adds commas every 3 digits
export const withCommas = number => {
  let sides = []
  sides = number.toString().split('.')
  sides[0] = sides[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return sides.join('.')
}
// BN helpers
export const toWei = ether => Eth.toWei(ether, 'ether')
export const toEther = wei => Eth.fromWei(wei, 'ether')
// Trim to 3 trailing decimals
export const trimDecimalsThree = n =>
  (+n).toFixed(3).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')

// convert FROM natural unit
// (reading logs or an event)
// TODO: tests
export const baseToConvertedUnit = (amount, decimals) => {
  if (_.isString(amount) || _.isObject(amount) || _.isNumber(amount)) {
    amount = BN(amount)
  }
  // if (!_.isNumber(amount)) console.log('amount', amount)
  // if (!_.isNumber(decimals)) console.log('decimals', decimals)
  const decimalPower = BN(10).pow(BN(decimals))
  const unit = amount.div(decimalPower)
  return unit
}

// sending txns convert TO natural unit
// 1,000,000 -> 1,000,000,000,000,000
// TODO: tests
export const convertedToBaseUnit = (amount, decimals) => {
  if (_.isString(amount) || _.isObject(amount) || _.isNumber(amount)) {
    amount = BN(amount)
  }
  // if (!_.isNumber(amount)) return false
  // if (!_.isNumber(decimals)) return false
  const decimalPower = BN(10).pow(BN(decimals))
  const naturalUnitAmount = BN(amount).mul(decimalPower)
  return naturalUnitAmount
}

export const divideAndGetWei = (numerator, denominator) => {
  const weiNumerator = Eth.toWei(BN(numerator), 'gwei')
  return weiNumerator.div(BN(denominator))
}

export const multiplyFromWei = (x, weiBN) => {
  if (!Eth.BN.isBN(weiBN)) {
    return false
  }
  const weiProduct = BN(x).mul(weiBN)
  return BN(Eth.fromWei(weiProduct, 'gwei'))
}

export const multiplyByPercentage = (x, y, z = 100) => {
  const weiQuotient = divideAndGetWei(y, z)
  return multiplyFromWei(x, weiQuotient)
}

export const bytesToHex = byteArray =>
  `0x${byteArray.reduce(
    (hexString, byte) => hexString + byte.toString(16),
    ''
  )}`

// export const base58Decode = encoded =>
//   JSON.parse(Buffer.from(bs58.decode(encoded)).toString('utf8'))

// export const base58Encode = o => bs58.encode(Buffer.from(JSON.stringify(o), 'utf8'))

// // adapted from: https://github.com/MyCryptoHQ/MyCrypto/blob/develop/common/libs/units.ts
// const stripRightZeros = str => {
//   const strippedStr = str.replace(/0+$/, '')
//   return strippedStr === '' ? null : strippedStr
// }
// const baseToConvertedUnit = (value, decimal) => {
//   if (decimal === 0) {
//     return value
//   }
//   const paddedValue = value.padStart(decimal + 1, '0') //0.1 ==>
//   const integerPart = paddedValue.slice(0, -decimal)
//   const fractionPart = stripRightZeros(paddedValue.slice(-decimal))
//   return fractionPart ? `${integerPart}.${fractionPart}` : `${integerPart}`
// }

// const convertedToBaseUnit = (value, decimal) => {
//   if (decimal === 0) {
//     return value
//   }
//   const [integerPart, fractionPart = ''] = value.split('.')
//   const paddedFraction = fractionPart.padEnd(decimal, '0')
//   return `${integerPart}${paddedFraction}`
// }

// const fromTokenBase = (value, decimal) =>
//   baseToConvertedUnit(value.toString(), decimal)

// const toTokenBase = (value, decimal) =>
//   BN(convertedToBaseUnit(value, decimal))

// const convertTokenBase = (value, oldDecimal, newDecimal) => {
//   if (oldDecimal === newDecimal) {
//     return value
//   }
//   return toTokenBase(fromTokenBase(value, oldDecimal), newDecimal)
// }

// export {
//   stripRightZeros,
//   baseToConvertedUnit,
//   convertedToBaseUnit,
//   fromTokenBase,
//   toTokenBase,
//   convertTokenBase,
// }