import Ethjs from 'ethjs'
import providers from 'ethers/providers'

export async function getEthersProvider(chainId) {
  if (
    typeof window.web3 !== 'undefined' &&
    typeof window.web3.currentProvider !== 'undefined'
  ) {
    // metamask
    return new providers.Web3Provider(window.web3.currentProvider, { chainId })
  } else if (process.env.NODE_ENV === 'development') {
    // ganache-cli
    return new providers.JsonRpcProvider('http://localhost:8545', { chainId })
  } else if (chainId === 1) {
    // infura
    return new providers.JsonRpcProvider('https://mainnet.infura.io', { chainId })
  } else if (chainId === 4) {
    // infura
    return new providers.JsonRpcProvider('https://rinkeby.infura.io', { chainId })
  }
}

export function getProvider(network) {
  if (
    typeof window !== 'undefined' &&
    typeof window.web3 !== 'undefined' &&
    typeof window.web3.currentProvider !== 'undefined'
  ) {
    // metamask
    return window.web3.currentProvider
  } else if (process.env.NODE_ENV === 'development') {
    // ganache-cli
    return new Ethjs.HttpProvider(`http://localhost:8545`)
  } else if (network === 'mainnet') {
    // infura
    return new Ethjs.HttpProvider(`https://mainnet.infura.io`)
  } else if (network === 'rinkeby') {
    // infura
    return new Ethjs.HttpProvider(`https://rinkeby.infura.io`)
  }
  return new Ethjs.HttpProvider(`https://rinkeby.infura.io`)
}

export function getEthjs(network) {
  const provider = getProvider(network)
  return new Ethjs(provider)
}
