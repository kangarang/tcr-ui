import * as types from './types'

function setupEthereumStart(network) {
  return {
    type: types.SETUP_ETHEREUM_START,
    network,
  }
}
function setupEthereumSucceeded(payload) {
  return {
    type: types.SETUP_ETHEREUM_SUCCEEDED,
    payload,
  }
}
function setupEthereumFailed(payload) {
  return {
    type: types.SETUP_ETHEREUM_FAILED,
    payload,
  }
}

export { setupEthereumStart, setupEthereumSucceeded, setupEthereumFailed }
