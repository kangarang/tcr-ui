export function stripHexPrefix(value) {
  return value.replace('0x', '')
}

export function stripHexPrefixAndLower(value) {
  return stripHexPrefix(value).toLowerCase()
}
