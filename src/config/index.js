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
  ],
  ganache: [
    // ordered chronologically by proxy deployment
    {
      name: 'The Test Chain Registry',
      registryAddress: '0x10fc2b8685003c86d74192980d846edf2755520f',
      tokenAddress: '0xa9248f9941a5a7ff8cbba3ff78347f9c13c74cfc',
      tokenSymbol: 'TEST',
      tokenName: 'TestToken',
      multihash: 'Qma3uaQ4RRSR1dR4vNj7CzFAHG5aY42tgBoW9HPWv89msT',
    },
    {
      name: 'The Sunset Registry',
      registryAddress: '0x0747bf92a886ab521ee7d95f6285420acc8b89ac',
      tokenAddress: '0xc4d09e6814037f08ec28ea4d450a6cdc0d0f7817',
      tokenSymbol: 'SUN',
      tokenName: 'SunToken',
      multihash: 'Qma3uaQ4RRSR1dR4vNj7CzFAHG5aY42tgBoW9HPWv89msT',
    },
  ],
}
