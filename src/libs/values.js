import {randomBytes} from 'crypto'
import ethUtil from 'ethereumjs-util'
import sigUtil from 'eth-sig-util'
import Eth from 'ethjs'

import util from 'ethjs-util'

// getBinarySize        <Function (String) : (Number)>
// intToBuffer          <Function (Number) : (Buffer)>
// intToHex             <Function (Number) : (String)>

// padToEven            <Function (String) : (String)>
// isHexPrefixed        <Function (String) : (Boolean)>
// isHexString          <Function (Value, Length) : (Boolean)>
// stripHexPrefix       <Function (String) : (String)>
// addHexPrefix         <Function (String) : (String)>

// getKeys              <Function (Params, Key, Empty) : (Array)>
// arrayContainsArray   <Function (Array, Array) : (Boolean)>

// fromAscii            <Function (String) : (String)>
// fromUtf8             <Function (String) : (String)>
// toAscii              <Function (String) : (String)>
// toUtf8               <Function (String) : (String)>
export function ethSign(msg, from) {
  eth.sign(from, msg, (err, result) => {
    if (err) return console.error(err)
    console.log('SIGNED:', result)
  })
}

export async function personalSign(msg, from) {
  const msg = ethUtil.bufferToHex(new Buffer(text, 'utf8'))
  const params = [msg, from]

  const eth = new Eth(getProvider())
  const signed = await eth.personal_sign(msg, from)
  // const serialized = await sigUtil.personalSign(pKey, params)

  console.log('signed', signed)
  console.log('Recovering...')

  const recovered = await eth.personal_ecRecover(msg, signed)

  if (recovered === from) {
    console.log('Ethjs recovered the message signer!')
  } else {
    console.log('Ethjs failed to recover the message signer!')
    console.dir({ recovered })
  }
}

export const isValidSignature = (data, signature, signingAddress) => {
  // const dataBuffer = util.intToBuffer(data)
  // const msgBuffer = util.
}

export function generatePseudoRandomSalt() {
  // const randBytes = randomBytes(32, (err, buf) => {
  //   if (err) throw err
  //   console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`)
  // })
  // const salt = randBytes
  // return salt
}

// get random integer 0 -> max
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export function stripHexPrefix(value) {
  return value.replace('0x', '');
}

export function stripHexPrefixAndLower(value) {
  return stripHexPrefix(value).toLowerCase();
}

export function padLeftEven(hex) {
  return hex.length % 2 !== 0 ? `0${hex}` : hex;
}

export function sanitizeHex(hex) {
  const hexStr = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex;
  return hex !== '' ? `0x${padLeftEven(hexStr)}` : '';
}


export function parseSignatureHexAsRSV(signatureHex) {
  const { v, r, s } = ethUtil.fromRpcSig(signatureHex);
  const ecSignature = {
      v,
      r: ethUtil.bufferToHex(r),
      s: ethUtil.bufferToHex(s),
  }
  return ecSignature
}