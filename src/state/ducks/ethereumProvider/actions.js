import types from './types'

function setupEthereumStart(network) {
  return {
    type: types.SETUP_ETHEREUM_START,
    network,
  }
}
function setABIs(abis) {
  return {
    type: types.SET_ABIS,
    abis,
  }
}
function setupEthereumSucceeded(payload) {
  return {
    type: types.SETUP_ETHEREUM_SUCCEEDED,
    payload,
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

function pollLogsStart(payload) {
  return {
    type: types.POLL_LOGS_START,
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

export default {
  setupEthereumStart,
  setABIs,
  setupEthereumSucceeded,
  setRegistryContract,
  setContracts,
  chooseTCR,
  pollLogsStart,
  updateBalancesSucceeded,
  updateBalancesStart,
}
