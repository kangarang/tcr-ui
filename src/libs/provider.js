import Ethjs from 'ethjs'

const INFURA_API_KEY = 'J0cQm2XzyYPau90i8jyk'
const PROVIDER_PORT = '7545'

let provider
let eth

const setProvider = (network) => {
  if (network === 'ganache') {
    provider = new Ethjs.HttpProvider(getProviderUrl(network))
  } else if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined') {
    provider = window.web3.currentProvider
  }
  return provider
}

export const getProvider = () => provider

export const getProviderUrl = (network) => {
  if (network === 'ganache') {
    return `http://localhost:${PROVIDER_PORT}`
  } else if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined') {
    return `https://rinkeby.infura.io/${INFURA_API_KEY}`
  }
}

export const setupEthjs = async (network) => {
  eth = new Ethjs(setProvider(network))
  return eth
}

export const getEthjs = () => eth
