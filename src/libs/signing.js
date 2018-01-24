import ethUtil, {
  addHexPrefix,
  ecsign,
  ecrecover,
  sha3,
  hashPersonalMessage,
  toBuffer,
  pubToAddress,
} from 'ethereumjs-util'

import jsSHA3 from 'js-sha3'

// adapted from:
// https://github.com/kvhnuke/etherwallet/blob/2a5bc0db1c65906b14d8c33ce9101788c70d3774/app/scripts/controllers/signMsgCtrl.js#L118
const signUtils = {
  signRawTxWithPrivKey: (privKey, t) => {
    t.sign(privKey)
    return t.serialize()
  },

  signMessageWithPrivKeyV2: (privKey, msg) => {
    const hash = hashPersonalMessage(toBuffer(msg))
    const signed = ecsign(hash, privKey)
    const combined = Buffer.concat([
      Buffer.from(signed.r),
      Buffer.from(signed.s),
      Buffer.from([signed.v]),
    ])
    console.log('signed', signed)
    console.log('combined', combined)
    const combinedHex = combined.toString('hex')

    return addHexPrefix(combinedHex)
  },

  verifySignedMessage: async ({ address, message, signature, version }) => {
    const sig = new Buffer(signUtils.stripHexPrefixAndLower(signature), 'hex')
    if (sig.length !== 65) {
      return false
    }
    //TODO: explain what's going on here
    sig[64] = sig[64] === 0 || sig[64] === 1 ? sig[64] + 27 : sig[64]
    const hash =
      version === '2' ? hashPersonalMessage(toBuffer(message)) : sha3(message)
    const pubKey = ecrecover(hash, sig[64], sig.slice(0, 32), sig.slice(32, 64))

    return (
      signUtils.stripHexPrefixAndLower(address) ===
      pubToAddress(pubKey).toString('hex')
    )
  },
  stripHexPrefix: value => {
    return value.replace('0x', '')
  },
  stripHexPrefixAndLower(value) {
    return signUtils.stripHexPrefix(value).toLowerCase()
  },
  padLeftEven(hex) {
    return hex.length % 2 !== 0 ? `0${hex}` : hex
  },
  sanitizeHex(hex) {
    const hexStr = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex
    return hex !== '' ? `0x${signUtils.padLeftEven(hexStr)}` : ''
  },
  parseSignatureHexAsRSV(signatureHex) {
    const { v, r, s } = ethUtil.fromRpcSig(signatureHex)
    const ecSignature = {
      v,
      r: ethUtil.bufferToHex(r),
      s: ethUtil.bufferToHex(s),
    }
    return ecSignature
  },
}

const BASIC_ADDRESS_REGEX = /^(0x)?[0-9a-f]{40}$/i
const SAME_CASE_ADDRESS_REGEX = /^(0x)?([0-9a-f]{40}|[0-9A-F]{40})$/

// see:
// https://github.com/0xProject/0x.js/blob/development/packages/utils/src/address_utils.ts
export const addressUtils = {
  isChecksumAddress: address => {
    // Check each case
    const unprefixedAddress = address.replace('0x', '')
    const addressHash = jsSHA3.keccak256(unprefixedAddress.toLowerCase())

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
  },

  isAddress: address => {
    if (!BASIC_ADDRESS_REGEX.test(address)) {
      // Check if it has the basic requirements of an address
      return false
    } else if (SAME_CASE_ADDRESS_REGEX.test(address)) {
      // If it's all small caps or all all caps, return true
      return true
    } else {
      // Otherwise check each case
      const isValidChecksummedAddress = addressUtils.isChecksumAddress(address)
      return isValidChecksummedAddress
    }
  },
}
