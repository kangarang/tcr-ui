import {
  CONTRACT_ERROR,
  LOGS_ERROR,
  UDAPP_ERROR,
  LOGIN_ERROR,
  GET_ETHEREUM,
  SET_ETHEREUM_PROVIDER,
  SET_WALLET,
  SET_CONTRACTS,
  SET_MIN_DEPOSIT,
  EXECUTE_METHOD_REQUEST,
  GET_TOKENS_ALLOWED,
  SET_TOKENS_ALLOWED,
  GET_ETH_PROVIDER,
  CLICK_ACTION_REQUEST,
  // SET_LOGS,
  POLL_LOGS_REQUEST,
  SET_DECODED_LOGS,
  NEW_ARRAY,
  NEW_ITEM,
  CHANGE_ITEM,
  CHANGE_ITEMS,
  CHANGE_SLIDER_VALUE,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  DELETE_LISTINGS,
  SET_CUSTOM_METHODS,
  REQUEST_MODAL_METHOD,
  SEND_TRANSACTION,
  CALL_REQUESTED,
} from './constants'

export function setupEthereum(network) {
  return {
    type: GET_ETHEREUM,
    network,
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
export function setEthereumProvider(payload) {
  return {
    type: SET_ETHEREUM_PROVIDER,
    payload,
  }
}

export function udappError(error) {
  return {
    type: UDAPP_ERROR,
    error,
  }
}
export function logsError(logType, error) {
  return {
    type: LOGS_ERROR,
    logType,
    error,
  }
}
export function loginError(error) {
  return {
    type: LOGIN_ERROR,
    error,
  }
}
export function contractError(error) {
  return {
    type: CONTRACT_ERROR,
    error,
  }
}
export function logoutSuccess(payload) {
  return {
    type: LOGOUT_SUCCESS,
    payload,
  }
}
export function loginSuccess(payload) {
  return {
    type: LOGIN_SUCCESS,
    payload,
  }
}
export function getProviderRequest() {
  return {
    type: GET_ETH_PROVIDER,
  }
}
export function pollLogsRequest(payload) {
  return {
    type: POLL_LOGS_REQUEST,
    payload,
  }
}

// Housekeeping
export function setMinDeposit(minDeposit) {
  return {
    type: SET_MIN_DEPOSIT,
    minDeposit,
  }
}

export function callRequested(payload) {
  return {
    type: CALL_REQUESTED,
    payload,
  }
}
export function sendTransaction(payload) {
  return {
    type: SEND_TRANSACTION,
    payload,
  }
}
export function requestModalMethod(payload) {
  return {
    type: REQUEST_MODAL_METHOD,
    payload,
  }
}

export function deleteListings(payload) {
  return {
    type: DELETE_LISTINGS,
    payload,
  }
}
// Token actions
export function getTokensAllowed(payload) {
  return {
    type: GET_TOKENS_ALLOWED,
    payload,
  }
}
export function setTokensAllowed(payload) {
  return {
    type: SET_TOKENS_ALLOWED,
    payload,
  }
}
export function newArray(payload) {
  return {
    type: NEW_ARRAY,
    payload,
  }
}
export function updateItems(payload) {
  return {
    type: CHANGE_ITEMS,
    payload,
  }
}

