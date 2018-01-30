import Eth from 'ethjs'

export const bigTen = number => new Eth.BN(number.toString(10), 10)

export const decimalConversion = decimals => bigTen(10).pow(bigTen(decimals))

export const toToken = (gToken, decimalPower) => bigTen(gToken).mul(decimalPower)
export const fromToken = (wToken, decimalPower) => bigTen(wToken).div(decimalPower)

// sending txns convert TO natural unit
// 1,000,000 -> 1,000,000,000,000,000
export const toBigToken = (smallToken, decimals) =>
  bigTen(smallToken).mul(decimalConversion(decimals))
// convert FROM natural unit
// (reading logs or an event)
export const fromNaturalUnit = (naturalUnit, decimals) =>
  bigTen(naturalUnit, decimals).div(decimalConversion(decimals))

export const withCommas = number =>
  number.toString(10).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export const toWei = ether => Eth.toWei(ether, 'ether')
export const toEther = wei => Eth.fromWei(wei, 'ether')

export const trimDecimalsThree = n =>
  (+n).toFixed(3).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')

// const numToHex = (num) => ethers.utils.bigNumberify(num).toHexString();
