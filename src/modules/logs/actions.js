import * as types from './types'

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
