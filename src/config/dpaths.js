// Full length deterministic wallet paths from BIP44
// https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
// normal path length is 4, ledger is the exception at 3
// m / purpose' / coin_type' / account' / change / address_index
//   |          |            |          |        |
//   | constant |   index    |  index   | 0 or 1 |
//   |__________|____________|__________|________|

export const ETH_DEFAULT = {
  label: 'Default (ETH)',
  value: "m/44'/60'/0'/0",
}

export const ETH_TREZOR = {
  label: 'TREZOR (ETH)',
  value: "m/44'/60'/0'/0",
}

export const ETH_LEDGER = {
  label: 'Ledger (ETH)',
  value: "m/44'/60'/0'",
}

export const ETH_TESTNET = {
  label: 'Testnet (ETH)',
  value: "m/44'/1'/0'/0",
}

export const DPaths = [ETH_DEFAULT, ETH_TREZOR, ETH_LEDGER, ETH_TESTNET]
