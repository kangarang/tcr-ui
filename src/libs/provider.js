import providers from 'ethers/providers'

let provider

export function setProvider() {
  let network, networkID
  if (
    typeof window.web3 !== 'undefined' &&
    typeof window.web3.currentProvider !== 'undefined'
  ) {
    networkID = window.web3.currentProvider.publicConfigStore._state.networkVersion
    console.log('provider networkID', networkID)
    network = (networkID === '4' ? 'rinkeby' : 'main')
    // metamask
    provider = new providers.Web3Provider(
      window.web3.currentProvider,
      network
    )
    console.log('web3 provider', provider)
    return provider
  }
  provider = new providers.getDefaultProvider(network)
  console.log('default provider', provider)
  return provider
}

export function getCurrentProvider() {
  if (typeof provider !== 'undefined') {
    return provider
  }
  return new Error('provider not set yet')
}
