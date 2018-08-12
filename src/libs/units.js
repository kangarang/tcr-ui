// https://github.com/MyCryptoHQ/MyCrypto/blob/develop/common/libs/units.ts
import BNJS from 'bn.js'
import { stripHexPrefix } from 'libs/formatters'

export const BN = small => {
  return new BNJS(small.toString(10), 10)
}

// Trim to 3 trailing decimals
export const trimDecimalsThree = n => {
  return (+n).toFixed(3).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')
}

export const ETH_DECIMAL = 18

const Units = {
  wei: '1',
  kwei: '1000',
  ada: '1000',
  femtoether: '1000',
  mwei: '1000000',
  babbage: '1000000',
  picoether: '1000000',
  gwei: '1000000000',
  shannon: '1000000000',
  nanoether: '1000000000',
  nano: '1000000000',
  szabo: '1000000000000',
  microether: '1000000000000',
  micro: '1000000000000',
  finney: '1000000000000000',
  milliether: '1000000000000000',
  milli: '1000000000000000',
  ether: '1000000000000000000',
  kether: '1000000000000000000000',
  grand: '1000000000000000000000',
  einstein: '1000000000000000000000',
  mether: '1000000000000000000000000',
  gether: '1000000000000000000000000000',
  tether: '1000000000000000000000000000000',
}

const handleValues = input => {
  if (typeof input === 'string') {
    return input.startsWith('0x') ? new BNJS(stripHexPrefix(input), 16) : new BNJS(input)
  }
  if (typeof input === 'number') {
    return new BNJS(input)
  }
  if (BNJS.isBN(input)) {
    return input
  } else {
    throw Error('unsupported value conversion')
  }
}

const Nonce = input => handleValues(input)
const Wei = input => handleValues(input)
const TokenValue = input => handleValues(input)
const getDecimalFromEtherUnit = key => Units[key].length - 1

const stripRightZeros = str => {
  const strippedStr = str.replace(/0+$/, '')
  return strippedStr === '' ? null : strippedStr
}

const baseToConvertedUnit = (value, decimal) => {
  if (decimal === 0) {
    return value.toString()
  }
  const paddedValue = value.toString().padStart(decimal + 1, '0')
  const integerPart = value.toString().slice(0, -decimal)
  const fractionPart = stripRightZeros(paddedValue.slice(-decimal))
  return fractionPart ? `${integerPart}.${fractionPart.slice(0, 2)}` : `${integerPart}`
}

const convertedToBaseUnit = (value, decimal) => {
  if (decimal === 0) {
    return value
  }
  const [integerPart, fractionPart = ''] = value.split('.')
  const paddedFraction = fractionPart.padEnd(decimal, '0')
  return `${integerPart}${paddedFraction}`
}

const fromWei = (wei, unit) => {
  const decimal = getDecimalFromEtherUnit(unit)
  return baseToConvertedUnit(wei.toString(), decimal)
}

const toWei = (value, decimal) => {
  const wei = convertedToBaseUnit(value, decimal)
  return Wei(wei)
}

const fromTokenBase = (value, decimal) => baseToConvertedUnit(value.toString(), decimal)

const toTokenBase = (value, decimal) =>
  TokenValue(convertedToBaseUnit(value.toString(), decimal))

const convertTokenBase = (value, oldDecimal, newDecimal) => {
  if (oldDecimal === newDecimal) {
    return value
  }
  return toTokenBase(fromTokenBase(value, oldDecimal), newDecimal)
}

const gasPriceToBase = price => toWei(price.toString(), getDecimalFromEtherUnit('gwei'))

export {
  TokenValue,
  fromWei,
  toWei,
  toTokenBase,
  fromTokenBase,
  convertTokenBase,
  Wei,
  getDecimalFromEtherUnit,
  Units,
  Nonce,
  handleValues,
  gasPriceToBase,
}
