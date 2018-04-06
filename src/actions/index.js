import {
  LOGIN_ERROR,
  CONTRACT_ERROR,
  LOGS_ERROR,
  TRANSACTION_ERROR,
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
export function pollLogsRequest(payload) {
  return {
    type: POLL_LOGS_REQUEST,
    payload,
  }
}
