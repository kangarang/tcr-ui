import Ethjs from 'ethjs'
// import metamask from 'metamascara'

// const ethereumProvider = metamask.createDefaultProvider({
//   host: 'HTTP://127.0.0.1:7545'
// })
// console.log('ethereumProvider', ethereumProvider)

const net = 'ganache'
// const net = 'production'

export const getProvider = () => {
  if (net === 'ganache') {
    // Dev: Ganache
    return new Ethjs.HttpProvider(getProviderUrl())
  } else if (
    typeof window.web3 !== 'undefined' &&
    typeof window.web3.currentProvider !== 'undefined'
  ) {
    // MetaMask
    return window.web3.currentProvider
  }
}

export const getProviderUrl = () => {
  if (net === 'ganache') {
    // Dev: Ganache
    return 'http://localhost:7545'
  } else if (typeof window.web3.currentProvider !== 'undefined') {
    // MetaMask
    return 'https://rinkeby.infura.io/J0cQm2XzyYPau90i8jyk'
  }
}

export const getEthjs = () => new Ethjs(getProvider())
