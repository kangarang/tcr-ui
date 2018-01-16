// import util from 'ethjs-util'

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