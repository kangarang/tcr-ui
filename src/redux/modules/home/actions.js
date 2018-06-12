import * as types from './types'

export function setupEthereumStart(network) {
  return {
    type: types.SETUP_ETHEREUM_START,
    network,
  }
}

export function setupEthereumSucceeded(payload) {
  return {
    type: types.SETUP_ETHEREUM_SUCCEEDED,
    payload,
  }
}

export function setupEthereumFailed(payload) {
  return {
    type: types.SETUP_ETHEREUM_FAILED,
    payload,
  }
}

export function setABIs(abis) {
  return {
    type: types.SET_ABIS,
    abis,
  }
}

export function setRegistryContract(payload) {
  return {
    type: types.SET_REGISTRY_CONTRACT,
    payload,
  }
}

export function setContracts(payload) {
  return {
    type: types.SET_CONTRACTS,
    payload,
  }
}

export function chooseTCR(payload) {
  return {
    type: types.CHOOSE_TCR,
    payload,
  }
}

export function updateBalancesStart() {
  return {
    type: types.UPDATE_BALANCES_START,
  }
}

export function updateBalancesSucceeded(payload) {
  return {
    type: types.UPDATE_BALANCES_SUCCEEDED,
    payload,
  }
}

export function updateBalancesFailed(payload) {
  return {
    type: types.UPDATE_BALANCES_FAILED,
    payload,
  }
}
