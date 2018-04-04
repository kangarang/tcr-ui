import providers from 'ethers/providers'

export function setProvider() {
  let provider
  if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined') {
    provider = new providers.Web3Provider(window.web3.currentProvider, { chainId: 420 })
    console.log('web3 provider', provider)
    return provider
  }
  provider = new providers.JsonRpcProvider('http://localhost:8545', { chainId: 420 })
  console.log('json rpc provider', provider)
  return provider
}
