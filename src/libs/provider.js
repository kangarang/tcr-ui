import Ethjs from 'ethjs'
const INFURA_API_KEY = 'J0cQm2XzyYPau90i8jyk'
const PROVIDER_PORT = '7545'

// import metamask from 'metamascara'
// const ethereumProvider = metamask.createDefaultProvider({
//   host: 'HTTP://127.0.0.1:7545'
// })
// console.log('ethereumProvider', ethereumProvider)

const net = 'development'

const safe = {
  provider: false,
  eth: false,
}

const setProvider = () => {
  // if (process.env.NODE_ENV === 'development') {
  if (net === 'development') {
    // Dev: Ganache
    safe.provider = new Ethjs.HttpProvider(getProviderUrl())
  } else if (
    typeof window.web3 !== 'undefined' &&
    typeof window.web3.currentProvider !== 'undefined'
  ) {
    // MetaMask
    safe.provider = window.web3.currentProvider
  }
  return safe.provider
}

export const getProvider = () => safe.provider

export const getProviderUrl = () => {
  // if (process.env.NODE_ENV === 'development') {
  if (net === 'development') {
    // Dev: Ganache
    return `http://localhost:${PROVIDER_PORT}`
  } else if (
    typeof window.web3 !== 'undefined' &&
    typeof window.web3.currentProvider !== 'undefined'
  ) {
    // MetaMask
    return `https://rinkeby.infura.io/${INFURA_API_KEY}`
  }
}

export const setupEthjs = async () => {
  safe.eth = new Ethjs(setProvider())
  return safe.eth
}

export const getEthjs = () => safe.eth
