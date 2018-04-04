import {
  LOGIN_ERROR,
  CONTRACT_ERROR,
  LOGS_ERROR,
  TRANSACTION_ERROR,
  GET_ETHEREUM,
  CHOOSE_TCR,
  UPDATE_BALANCES_REQUEST,
  POLL_LOGS_REQUEST,
} from './constants'

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
export function transactionError(error) {
  return {
    type: TRANSACTION_ERROR,
    error,
  }
}
export function setupEthereum(network) {
  return {
    type: GET_ETHEREUM,
    network,
  }
}
export function chooseTCR(payload) {
  return {
    type: CHOOSE_TCR,
    payload,
  }
}
export function updateBalancesRequest() {
  return {
    type: UPDATE_BALANCES_REQUEST,
  }
}
export function pollLogsRequest(payload) {
  return {
    type: POLL_LOGS_REQUEST,
    payload,
  }
}
