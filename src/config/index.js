// ipfs multihash to retrieve ABIs
export const ipfsABIsHash = 'Qma3uaQ4RRSR1dR4vNj7CzFAHG5aY42tgBoW9HPWv89msT'
export const ipfsTokensHash = 'QmRH8e8ssnj1CWVepGvAdwaADKNkEpgDU5bffTbeS6JuG9'
// hardcoded FORCED registry address
export const hardcodedRegistryAddress = ''
export const defaultRegistryAddress = '0x39cfbe27e99bafa761dac4566b4af3b4c9cc8fbe'

export function getIpfsABIsHash(network) {
  if (network === 'mainnet') {
    return 'QmRnEq62FYcEbjsCpQjx8MwGfBfo35tE6UobxHtyhExLNu'
  } else {
    return ipfsABIsHash
  }
}

export const registries = {
  rinkeby: [
    {
      name: 'humans',
      registryAddress: '0xaf3534DeddA9905FCff9862DAf77ED6477e3E731',
      votingAddress: '0x212Ee8D31349Bedb23A7931A0f9D9Ef864e0795E',
      tokenAddress: '0xD0d667d5dd42574ecACd8bdDe3d6A4F6b583E794',
      tokenSymbol: 'HMN',
      tokenName: 'Humans',
      multihash: 'Qma3uaQ4RRSR1dR4vNj7CzFAHG5aY42tgBoW9HPWv89msT',
    },
    {
      name: 'ethaireum',
      registryAddress: '0x39cfbe27e99bafa761dac4566b4af3b4c9cc8fbe',
      votingAddress: '0x946184cde118286d46825b866521d0236800c613',
      tokenAddress: '0x73064ef6b8aa6d7a61da0eb45e53117718a3e891',
      tokenSymbol: 'HAIR',
      tokenName: 'ethair',
      multihash: 'Qma3uaQ4RRSR1dR4vNj7CzFAHG5aY42tgBoW9HPWv89msT',
    },
  ],
}
