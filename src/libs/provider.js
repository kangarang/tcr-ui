import providers from 'ethers/providers'

let provider

export function setProvider() {
  if (
    typeof window.web3 !== 'undefined' &&
    typeof window.web3.currentProvider !== 'undefined'
  ) {
    // metamask
    provider = new providers.Web3Provider(window.web3.currentProvider, 'rinkeby')
    return provider
  }
  provider = providers.getDefaultProvider('rinkeby')
  return provider
}

export function getCurrentProvider() {
  if (typeof provider !== 'undefined') {
    return provider
  }
  return new Error('provider not set yet')
}
