import {
  CONTRACT_ERROR,
  LOGS_ERROR,
  UDAPP_ERROR,
  LOGIN_ERROR,
  GET_ETHEREUM,
  // SET_ETHEREUM_PROVIDER,
  SET_WALLET,
  SET_CONTRACTS,
  SET_MIN_DEPOSIT,
  GET_TOKENS_ALLOWED,
  SET_TOKENS_ALLOWED,
  GET_ETH_PROVIDER,
  POLL_LOGS_REQUEST,
  NEW_ARRAY,
  CHANGE_ITEMS,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  DELETE_LISTINGS,
  REQUEST_MODAL_METHOD,
  SEND_TRANSACTION,
  CALL_REQUESTED,
  UPDATE_BALANCES_REQUEST,
  UPDATE_BALANCES,
  TXN_MINED,
  TXN_REVERTED,
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
// export function setEthereumProvider(payload) {
//   return {
//     type: SET_ETHEREUM_PROVIDER,
//     payload,
//   }
// }

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
export function txnMined(payload) {
  return {
    type: TXN_MINED,
    payload,
  }
}
export function txnReverted(payload) {
  return {
    type: TXN_REVERTED,
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

