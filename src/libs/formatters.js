export const stripHexPrefix = value => value.replace('0x', '')

export const stripHexPrefixAndLower = value => stripHexPrefix(value).toLowerCase()
