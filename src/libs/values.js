import { addHexPrefix } from 'ethereumjs-util';

// import { Wei, toTokenBase } from 'libs/units';

export function stripHexPrefix(value) {
  return value.replace('0x', '');
}

export function stripHexPrefixAndLower(value) {
  return stripHexPrefix(value).toLowerCase();
}

// export function toHexWei(weiString) {
//   return addHexPrefix(Wei(weiString).toString(16));
// }

export function padLeftEven(hex) {
  return hex.length % 2 !== 0 ? `0${hex}` : hex;
}

export function sanitizeHex(hex) {
  const hexStr = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex;
  return hex !== '' ? `0x${padLeftEven(hexStr)}` : '';
}