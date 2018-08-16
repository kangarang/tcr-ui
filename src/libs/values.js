import utils from 'ethers/utils'
import { randomBytes } from 'crypto'
import { BN } from './units'

export function randomSalt() {
  const buf = randomBytes(32)
  const salt = BN(`0x${buf.toString('hex')}`)
  return salt.toString()
}

// prettier-ignore
export const getVoteSaltHash = (vote, salt) => utils.solidityKeccak256(['uint', 'uint'], [vote, salt])
export const getListingHash = listing => utils.solidityKeccak256(['string'], [listing])

// from: https://github.com/0xProject/0x-monorepo/blob/development/packages/utils/src/address_utils.ts
const BASIC_ADDRESS_REGEX = /^(0x)?[0-9a-f]{40}$/i
const SAME_CASE_ADDRESS_REGEX = /^(0x)?([0-9a-f]{40}|[0-9A-F]{40})$/

export function isChecksumAddress(address) {
  // Check each case
  const unprefixedAddress = address.replace('0x', '')
  const addressHash = utils.keccak256(unprefixedAddress.toLowerCase())

  for (let i = 0; i < 40; i++) {
    // The nth letter should be uppercase if the nth digit of casemap is 1
    if (
      (parseInt(addressHash[i], 16) > 7 &&
        unprefixedAddress[i].toUpperCase() !== unprefixedAddress[i]) ||
      (parseInt(addressHash[i], 16) <= 7 &&
        unprefixedAddress[i].toLowerCase() !== unprefixedAddress[i])
    ) {
      return false
    }
  }
  return true
}

export function isAddress(address) {
  if (!BASIC_ADDRESS_REGEX.test(address)) {
    // Check if it has the basic requirements of an address
    return false
  } else if (SAME_CASE_ADDRESS_REGEX.test(address)) {
    // If it's all small caps or all all caps, return true
    return true
  }
  // Otherwise check each case
  return isChecksumAddress(address)
}
