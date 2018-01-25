import ethUtil, {
  addHexPrefix,
  ecsign,
  ecrecover,
  sha3,
  hashPersonalMessage,
  toBuffer,
  pubToAddress,
} from 'ethereumjs-util'


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