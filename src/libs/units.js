import Eth from 'ethjs'

const bigTen = (number) => new Eth.BN(number.toString(10), 10)

const toDecimalPower = (decimals) => bigTen(10).pow(bigTen(decimals))

const toToken = (gToken, decimalPower) => bigTen(gToken).mul(decimalPower)
const fromToken = (gToken, decimalPower) => bigTen(gToken).div(decimalPower)

const toNineToken = (gToken) => bigTen(gToken).div(toDecimalPower(9))

const withCommas = (number) =>
  number.toString(10).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

const toWei = (ether) => Eth.toWei(ether, 'ether')
const toEther = (wei) => Eth.fromWei(wei, 'ether')

const trimDecimalsThree = (n) =>
  (+n).toFixed(3).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')

// const numToHex = (num) => ethers.utils.bigNumberify(num).toHexString();

export {
  bigTen,
  toDecimalPower,
  toToken,
  fromToken,
  withCommas,
  toWei,
  toEther,
  trimDecimalsThree,
  toNineToken,
}
