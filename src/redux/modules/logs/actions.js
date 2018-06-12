import * as types from './types'

export function pollLogsStart(payload) {
  return {
    type: types.POLL_LOGS_START,
    payload,
  }
}

export function pollLogsSucceeded(payload) {
  return {
    type: types.POLL_LOGS_SUCCEEDED,
    payload,
  }
}

export function pollLogsFailed(payload) {
  return {
    type: types.POLL_LOGS_FAILED,
    payload,
  }
}

export function pollApplicationLogsSucceeded(payload) {
  return {
    type: types.FRESH_APPLICATIONS,
    payload,
  }
}
