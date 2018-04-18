import Ethjs from 'ethjs'

let ethjs = undefined

// prefer metamask provider
// return local rpc otherwise
function setupProvider() {
  if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined') {
    // metamask
    return window.web3.currentProvider
  }
  // ganache-cli
  return new Ethjs.HttpProvider(`http://localhost:8545`)
}

// set ethjs and return it
function setEthjs() {
  // metamask or ganache-cli
  const provider = setupProvider()
  // set global
  ethjs = new Ethjs(provider)
  return ethjs
}

// retrieve defined global ethjs
function getEthjs() {
  if (ethjs !== undefined) {
    return ethjs
  }
  return new Error('ethjs is undefined')
}

export { setEthjs, getEthjs }
