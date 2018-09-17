// ipfs multihash to retrieve ABIs
export const ipfsABIsHash = 'QmdvnGG7NCLsH5u4kxe2pcVcDGvxNtfouccRHBT64jvPGr'
export const ipfsTokensHash = 'QmRH8e8ssnj1CWVepGvAdwaADKNkEpgDU5bffTbeS6JuG9'
// hardcoded FORCED registry address
export const hardcodedRegistryAddress = ''
export const defaultRegistryAddress = ''

export function getIpfsABIsHash(tokenAddress) {
  if (tokenAddress === '0xd0d6d6c5fe4a677d343cc433536bb717bae167dd') {
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
      tokenAddress: '0x6bb36e335c8f1b483903c4d56bac161f1ea104fd',
      votingAddress: '0x2650dd674462658d1560be06c5d71b9d5e6c5ab0',
      parameterizerAddress: '0x7e40a2fb800cfffacdc3d0cc7d37db9d4ac5fcca',
      registryAddress: '0x3b162630d3de8ea1df670aadf8a549849f7d6b2a',
      tokenSymbol: 'SUN',
      tokenName: 'SunToken',
      multihash: 'QmdvnGG7NCLsH5u4kxe2pcVcDGvxNtfouccRHBT64jvPGr',
    },
    {
      name: 'ethaireum',
      tokenAddress: '0x7b003c03261d5a272635bd6a67527fff8e85d84e',
      votingAddress: '0x782d86aa05d16e4c5aa48b9ad478403c5976d878',
      parameterizerAddress: '0x9c3a507573e7917e611e198c3df8db5eeb81994f',
      registryAddress: '0x659f3399970145d2e2da217f88e8e54818beaceb',
      tokenSymbol: 'HAIR',
      tokenName: 'Ethair',
      multihash: 'QmdvnGG7NCLsH5u4kxe2pcVcDGvxNtfouccRHBT64jvPGr',
    },
  ],
  ganache: [
    {
      name: 'The Test Chain Registry',
      tokenAddress: '0xa9248f9941a5a7ff8cbba3ff78347f9c13c74cfc',
      votingAddress: '0x4e4af4a68163c5671d4644c4959789edb470f04f',
      parameterizerAddress: '0x404fef4ef29285b7dda25774215bdc5ea3907f5a',
      registryAddress: '0x10fc2b8685003c86d74192980d846edf2755520f',
      tokenSymbol: 'TEST',
      tokenName: 'TestToken',
      multihash: 'QmdvnGG7NCLsH5u4kxe2pcVcDGvxNtfouccRHBT64jvPGr',
    },
    {
      name: 'The Sunset Registry',
      tokenAddress: '0xc4d09e6814037f08ec28ea4d450a6cdc0d0f7817',
      votingAddress: '0x1295c924418b1e726d49db92cd401cac48ae6905',
      parameterizerAddress: '0xc2f5eced98fa839a219878cf18501a84d4af4873',
      registryAddress: '0x0747bf92a886ab521ee7d95f6285420acc8b89ac',
      tokenSymbol: 'SUN',
      tokenName: 'SunToken',
      multihash: 'QmdvnGG7NCLsH5u4kxe2pcVcDGvxNtfouccRHBT64jvPGr',
    },
  ],
}
