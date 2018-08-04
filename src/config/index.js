// ipfs multihash to retrieve ABIs
export const ipfsABIsHash = 'Qma3uaQ4RRSR1dR4vNj7CzFAHG5aY42tgBoW9HPWv89msT'
export const ipfsTokensHash = 'QmRH8e8ssnj1CWVepGvAdwaADKNkEpgDU5bffTbeS6JuG9'
// hardcoded FORCED registry address
export const hardcodedRegistryAddress = ''
export const defaultRegistryAddress = ''

export function getIpfsABIsHash(network) {
  if (network === 'mainnet') {
    return 'QmRnEq62FYcEbjsCpQjx8MwGfBfo35tE6UobxHtyhExLNu'
  } else {
    return ipfsABIsHash
  }
}

export const registries = {
  mainnet: [
    {
      name: 'The adChain Registry',
      registryAddress: '0x5e2eb68a31229b469e34999c467b017222677183',
      votingAddress: '0xb4b26709ffed2cd165b9b49eea1ac38d133d7975',
      tokenAddress: '0xd0d6d6c5fe4a677d343cc433536bb717bae167dd',
      tokenSymbol: 'ADT',
      tokenName: 'adToken',
      multihash: 'QmRnEq62FYcEbjsCpQjx8MwGfBfo35tE6UobxHtyhExLNu',
    },
  ],
  rinkeby: [
    {
      name: 'The Sunset Registry',
      registryAddress: '0x3a1f892ab191e06a5769aa8bb9f1a95d06e30194',
      votingAddress: '0x7235d99de42272160b90370e6a9e67c044d31ea5',
      tokenAddress: '0xec717dbf0f1ec373c46197f88df796f118295bdd',
      tokenSymbol: 'SUN',
      tokenName: 'SunToken',
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
