import providers from 'ethers/providers'

let provider

export function setProvider() {
  if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined') {
    const networkID = window.web3.currentProvider.publicConfigStore._state.networkVersion
    const network =
      networkID === '4'
        ? 'rinkeby'
        : networkID === '1' ? 'mainnet' : networkID === '420' ? 'ganache' : 'unknown'
    provider = new providers.Web3Provider(window.web3.currentProvider, network)
    // console.log('web3 provider', provider)
    return provider
  }
  provider = new providers.JsonRpcProvider('http://localhost:8545')
  // console.log('json rpc provider', provider)
  return provider
}

export function getCurrentProvider() {
  if (typeof provider !== 'undefined') {
    return provider
  }
  return new Error('provider not set yet')
}
