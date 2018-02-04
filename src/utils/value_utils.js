import Eth from 'ethjs'
// import bs58 from 'bs58'
// import _ from 'lodash'

export const BN = small => new Eth.BN(small.toString(10), 10)

export const withCommas = number => {
  let sides = []
  sides = number.toString().split('.')
  sides[0] = sides[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return sides.join('.')
}

export const toWei = ether => Eth.toWei(ether, 'ether')
export const toEther = wei => Eth.fromWei(wei, 'ether')

export const trimDecimalsThree = n =>
  (+n).toFixed(3).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')

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

export default {
  bytesToHex: bytes =>
    `0x${byteArray.reduce(
      (hexString, byte) => hexString + byte.toString(16),
      ''
    )}`,

  // convert FROM natural unit
  // (reading logs or an event)
  toUnitAmount: (amount, decimals) => {
    // if (!_.isNumber(amount)) console.log('amount', amount)
    // if (!_.isNumber(decimals)) console.log('decimals', decimals)
    const decimalPower = BN(10).pow(BN(18))
    const unit = amount.div(decimalPower)
    return unit
  },

  // sending txns convert TO natural unit
  // 1,000,000 -> 1,000,000,000,000,000
  toNaturalUnitAmount: (amount, decimals) => {
    // if (!_.isNumber(amount)) return false
    // if (!_.isNumber(decimals)) return false
    const unit = BN(10).pow(BN(18))
    const naturalUnitAmount = BN(amount).mul(unit)
    console.log('naturalUnitAmount', naturalUnitAmount.toString())
    // const hasDecimals = naturalUnitAmount.decimalPlaces() !== 0
    // if (hasDecimals) {
    //   throw new Error(
    //     `Invalid natural unit amount: ${amount.toString(
    //       10
    //     )} - Too many decimal places!`
    //   )
    // }
    return naturalUnitAmount
  },

  divideAndGetWei: (numerator, denominator) => {
    const weiNumerator = Eth.toWei(BN(numerator), 'gwei')
    return weiNumerator.div(BN(denominator))
  },

  multiplyFromWei: (x, weiBN) => {
    if (!Eth.BN.isBN(weiBN)) {
      return false
    }
    const weiProduct = BN(x).mul(weiBN)
    return BN(Eth.fromWei(weiProduct, 'gwei'))
  },

  multiplyByPercentage: (x, y, z = 100) => {
    const weiQuotient = value_utils.divideAndGetWei(y, z)
    return value_utils.multiplyFromWei(x, weiQuotient)
  },

  // base58Decode: encoded =>
  //   JSON.parse(Buffer.from(bs58.decode(encoded)).toString('utf8')),

  // base58Encode: o => bs58.encode(Buffer.from(JSON.stringify(o), 'utf8')),
}