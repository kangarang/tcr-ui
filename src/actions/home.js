export const UPDATE_BALANCES = 'UPDATE_BALANCES--Home'
export const SET_REGISTRY_CONTRACT = 'SET_REGISTRY_CONTRACT--Home'
export const SET_CONTRACTS = 'SET_CONTRACTS--Home'
export const SET_WALLET = 'SET_WALLET--Home'
export const UPDATE_BALANCES_REQUEST = 'UPDATE_BALANCES_REQUEST--Token'

export function updateBalancesRequest() {
  return {
    type: UPDATE_BALANCES_REQUEST,
  }
}
export function updateBalances(payload) {
  return {
    type: UPDATE_BALANCES,
    payload,
  }
}
export function setRegistryContract(payload) {
  return {
    type: SET_REGISTRY_CONTRACT,
    payload,
  }
}
export function setContracts(payload) {
  return {
    type: SET_CONTRACTS,
    payload,
  }
}
export function setWallet(payload) {
  return {
    type: SET_WALLET,
    payload,
  }
}
