import Eth from 'ethjs'
import _ from 'lodash'

const BN = small => new Eth.BN(small.toString(10), 10)

const valUtils = {
  randInt: (min, max) => {
    if (max === undefined) {
      max = min
      min = 0
    }
    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new TypeError('All args should have been numbers')
    }
    return Math.floor(Math.random() * (max - min + 1) + min)
  },

  toUnitAmount: (amount, decimals) => {
    if (!_.isNumber(amount)) return false
    if (!_.isNumber(decimals)) return false
    const aUnit = BN(10).pow(decimals)
    const unit = amount.div(aUnit)
    return unit
  },

  toNaturalUnitAmount: (amount, decimals) => {
    if (!_.isNumber(amount)) return false
    if (!_.isNumber(decimals)) return false
    const unit = BN(10).pow(decimals)
    const naturalUnitAmount = amount.times(unit)
    const hasDecimals = naturalUnitAmount.decimalPlaces() !== 0
    if (hasDecimals) {
      throw new Error(
        `Invalid natural unit amount: ${amount.toString(
          10
        )} - Too many decimal places!`
      )
    }
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
    const weiQuotient = valUtils.divideAndGetWei(y, z)
    return valUtils.multiplyFromWei(x, weiQuotient)
  },
}

export default valUtils
