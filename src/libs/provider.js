import providers from 'ethers/providers'

export function setProvider() {
  const chainId = 420
  if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined') {
    const provider = new providers.Web3Provider(window.web3.currentProvider, { chainId })
    console.log('web3 provider', provider)
    return provider
  }
  const jsonProvider = new providers.JsonRpcProvider('http://localhost:8545', { chainId })
  console.log('json rpc provider', jsonProvider)
  return jsonProvider
}
