import Ethjs from 'ethjs'
import { config } from '../config'

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
  return new Ethjs(getProvider())
}
