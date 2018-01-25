import Ethjs from 'ethjs'
import { config } from '../config'

let eth

export const getProvider = () => {
  if (
    typeof window.web3 !== 'undefined' &&
    typeof window.web3.currentProvider !== 'undefined'
  ) {
    return window.web3.currentProvider
  }
  return Ethjs.HttpProvider(`http://localhost:${config.PROVIDER_PORT}`)
}

export const setupEthjs = () => {
  eth = new Ethjs(getProvider())
  return eth
}

export const getEthjs = () => eth
