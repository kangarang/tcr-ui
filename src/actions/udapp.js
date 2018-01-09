import {
  EXECUTE_METH,
  SET_ABI,
  SET_ADDRESS,
  SET_FROM_ADDRESS,
  REFRESH_ETH_STORE,
} from './constants'

export function setAddress(address) {
  return {
    type: SET_ADDRESS,
    address,
  }
}
export function sendExecute(method) {
  return {
    type: EXECUTE_METH,
    method,
  }
}
export function setFromAddress(fromAddress) {
  return {
    type: SET_FROM_ADDRESS,
    fromAddress,
  }
}
export function refreshEthStore(key) {
  return {
    type: REFRESH_ETH_STORE,
    key,
  }
}
export function setAbi(abi) {
  return {
    type: SET_ABI,
    abi,
  }
}