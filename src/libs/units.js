import Eth from 'ethjs'

const bigTen = (number) => new Eth.BN(number.toString(10), 10)

const decimalConversion = (decimals) => bigTen(10).pow(bigTen(decimals))

const toToken = (gToken, decimalPower) => bigTen(gToken).mul(decimalPower)
const fromToken = (wToken, decimalPower) => bigTen(wToken).div(decimalPower)

// sending txns convert TO natural unit
// 1,000,000 -> 1,000,000,000,000,000
const toNineToken = (smallToken) => bigTen(smallToken).mul(decimalConversion(9))
// convert FROM natural unit
// (reading logs)
const fromNaturalUnit = (naturalUnit) => bigTen(naturalUnit).div(decimalConversion(9))

const withCommas = (number) =>
  number.toString(10).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

const toWei = (ether) => Eth.toWei(ether, 'ether')
const toEther = (wei) => Eth.fromWei(wei, 'ether')

const trimDecimalsThree = (n) =>
  (+n).toFixed(3).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')

// const numToHex = (num) => ethers.utils.bigNumberify(num).toHexString();

export {
  bigTen,
  decimalConversion,

  toToken,
  fromToken,

  toNineToken,
  fromNaturalUnit,

  withCommas,

  toWei,
  toEther,

  trimDecimalsThree,
}
