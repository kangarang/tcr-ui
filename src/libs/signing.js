import ethUtil, {
  addHexPrefix,
  ecsign,
  ecrecover,
  sha3,
  hashPersonalMessage,
  toBuffer,
  pubToAddress
} from 'ethereumjs-util';

import Eth from 'ethjs'
import sigUtil from 'eth-sig-util'

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

// See: https://github.com/MyEtherWallet/MyEtherWallet/blob/develop/common/libs/signing.ts
export function signRawTxWithPrivKey(privKey, t) {
  t.sign(privKey);
  return t.serialize();
}

// adapted from:
// https://github.com/kvhnuke/etherwallet/blob/2a5bc0db1c65906b14d8c33ce9101788c70d3774/app/scripts/controllers/signMsgCtrl.js#L95
export function signMessageWithPrivKeyV2(privKey, msg) {
  const hash = hashPersonalMessage(toBuffer(msg));
  const signed = ecsign(hash, privKey);
  const combined = Buffer.concat([
    Buffer.from(signed.r),
    Buffer.from(signed.s),
    Buffer.from([signed.v])
  ]);
  console.log('signed', signed)
  console.log('combined', combined)
  const combinedHex = combined.toString('hex');

  return addHexPrefix(combinedHex);
}

// adapted from:
// https://github.com/kvhnuke/etherwallet/blob/2a5bc0db1c65906b14d8c33ce9101788c70d3774/app/scripts/controllers/signMsgCtrl.js#L118
export function verifySignedMessage({ address, message, signature, version }) {
  const sig = new Buffer(stripHexPrefixAndLower(signature), 'hex');
  if (sig.length !== 65) {
    return false;
  }
  //TODO: explain what's going on here
  sig[64] = sig[64] === 0 || sig[64] === 1 ? sig[64] + 27 : sig[64];
  const hash = version === '2' ? hashPersonalMessage(toBuffer(message)) : sha3(message);
  const pubKey = ecrecover(hash, sig[64], sig.slice(0, 32), sig.slice(32, 64));

  return stripHexPrefixAndLower(address) === pubToAddress(pubKey).toString('hex');
}

export function stripHexPrefix(value) {
  return value.replace('0x', '')
}

export function stripHexPrefixAndLower(value) {
  return stripHexPrefix(value).toLowerCase()
}

export function padLeftEven(hex) {
  return hex.length % 2 !== 0 ? `0${hex}` : hex
}

export function sanitizeHex(hex) {
  const hexStr = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex
  return hex !== '' ? `0x${padLeftEven(hexStr)}` : ''
}

export function parseSignatureHexAsRSV(signatureHex) {
  const { v, r, s } = ethUtil.fromRpcSig(signatureHex)
  const ecSignature = {
    v,
    r: ethUtil.bufferToHex(r),
    s: ethUtil.bufferToHex(s),
  }
  return ecSignature
}

export const isValidSignature = (data, signature, signingAddress) => {
  // const dataBuffer = util.intToBuffer(data)
  // const msgBuffer = util.
}