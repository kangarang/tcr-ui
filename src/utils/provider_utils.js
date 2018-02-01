import Ethjs from 'ethjs'

let provider
let ethjs

export function setProvider() {
  if (
    typeof window.web3 !== 'undefined' &&
    typeof window.web3.currentProvider !== 'undefined'
  ) {
    // metamask
    provider = window.web3.currentProvider
    return provider
  }
  // ganache-cli
  provider = Ethjs.HttpProvider(`http://localhost:8545`)
  return provider
}

export function getCurrentProvider() {
  if (typeof provider !== 'undefined') {
    return provider
  }
  return new Error('provider not set yet')
}

export function setEthjs() {
  ethjs = new Ethjs(setProvider())
  return ethjs
}

export function getEthjs() {
  if (typeof ethjs !== 'undefined') {
    return ethjs
  }
  return new Error('ethjs not set yet')
}