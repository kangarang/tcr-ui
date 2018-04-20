import Ethjs from 'ethjs'
import providers from 'ethers/providers'

let ethersProvider = undefined
// prefer metamask provider
// return local rpc otherwise
// set global ethersProvider
async function setEthersProvider(chainId) {
  if (
    typeof window.web3 !== 'undefined' &&
    typeof window.web3.currentProvider !== 'undefined'
  ) {
    ethersProvider = new providers.Web3Provider(window.web3.currentProvider, { chainId })
    return ethersProvider
  }
  ethersProvider = new providers.JsonRpcProvider('http://localhost:8545', { chainId })
  return ethersProvider
}

// retrieve defined global ethersProvider
function getEthersProvider() {
  if (ethersProvider !== undefined) {
    return ethersProvider
  }
  throw new Error('ethersProvider is undefined')
}

let ethjs = undefined
// prefer metamask provider
// return local rpc otherwise
function setProvider() {
  if (
    typeof window.web3 !== 'undefined' &&
    typeof window.web3.currentProvider !== 'undefined'
  ) {
    // metamask
    return window.web3.currentProvider
  }
  // ganache-cli
  return new Ethjs.HttpProvider(`http://localhost:8545`)
}

// set ethjs and return it
function setEthjs() {
  // metamask or ganache-cli
  const provider = setProvider()
  // set global
  ethjs = new Ethjs(provider)
  return ethjs
}

// retrieve defined global ethjs
function getEthjs() {
  if (ethjs !== undefined) {
    return ethjs
  }
  throw new Error('ethjs is undefined')
}

export { setEthjs, getEthjs, setProvider, setEthersProvider, getEthersProvider }
