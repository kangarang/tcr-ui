import Ethjs from 'ethjs'
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
    return 'http://localhost:7545'
  } else if (
    typeof window.web3 !== 'undefined' &&
    typeof window.web3.currentProvider !== 'undefined'
  ) {
    // MetaMask
    return 'https://rinkeby.infura.io/J0cQm2XzyYPau90i8jyk'
  }
}

export const setupEthjs = () => {
  safe.eth = new Ethjs(setProvider())
  return safe.eth
}

export const getEthjs = () => safe.eth
