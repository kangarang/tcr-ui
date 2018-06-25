import * as types from './types'

export function showNotificationStart(payload) {
  return {
    type: types.SHOW_NOTIFICATION_START,
    payload,
  }
}

export function showNotificationSucceeded(payload) {
  return {
    type: types.SHOW_NOTIFICATION_SUCCEEDED,
    payload,
  }
}

export function showNotificationFailed(payload) {
  return {
    type: types.SHOW_NOTIFICATION_FAILED,
    payload,
  }
}
export function decodeLogsStart(payload) {
  return {
    type: types.DECODE_LOGS_START,
    payload,
  }
}

export function decodeLogsSucceeded(payload) {
  return {
    type: types.DECODE_LOGS_SUCCEEDED,
    payload,
  }
}

export function decodeLogsFailed(payload) {
  return {
    type: types.DECODE_LOGS_FAILED,
    payload,
  }
}
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
