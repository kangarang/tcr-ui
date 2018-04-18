import types from './types'

function setupEthereum(network) {
  return {
    type: types.SETUP_ETHEREUM_REQUEST,
    network,
  }
}
function setABIs(abis) {
  return {
    type: types.SET_ABIS,
    abis,
  }
}
function setWallet(payload) {
  return {
    type: types.SET_WALLET,
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

function pollLogsRequest(payload) {
  return {
    type: types.POLL_LOGS_REQUEST,
    payload,
  }
}

function updateBalancesRequest() {
  return {
    type: types.UPDATE_BALANCES_REQUEST,
  }
}
function updateBalances(payload) {
  return {
    type: types.UPDATE_BALANCES,
    payload,
  }
}

export default {
  setupEthereum,
  setABIs,
  setWallet,
  setRegistryContract,
  setContracts,
  chooseTCR,
  pollLogsRequest,
  updateBalances,
  updateBalancesRequest,
}
