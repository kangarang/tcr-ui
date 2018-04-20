import * as types from './types'

function setABIs(abis) {
  return {
    type: types.SET_ABIS,
    abis,
  }
}
function setRegistryContract(payload) {
  return {
    type: types.SET_REGISTRY_CONTRACT,
    payload,
  }
}
function setContracts(payload) {
  return {
    type: types.SET_CONTRACTS,
    payload,
  }
}
function chooseTCR(payload) {
  return {
    type: types.CHOOSE_TCR,
    payload,
  }
}
function updateBalancesStart() {
  return {
    type: types.UPDATE_BALANCES_START,
  }
}
function updateBalancesSucceeded(payload) {
  return {
    type: types.UPDATE_BALANCES_SUCCEEDED,
    payload,
  }
}
function updateBalancesFailed(payload) {
  return {
    type: types.UPDATE_BALANCES_FAILED,
    payload,
  }
}

export {
  setABIs,
  setRegistryContract,
  setContracts,
  chooseTCR,
  updateBalancesStart,
  updateBalancesSucceeded,
  updateBalancesFailed,
}
