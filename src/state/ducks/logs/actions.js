import * as types from './types'

function pollLogsStart(payload) {
  return {
    type: types.POLL_LOGS_START,
    payload,
  }
}
function pollLogsSucceeded(payload) {
  return {
    type: types.POLL_LOGS_SUCCEEDED,
    payload,
  }
}
function pollLogsFailed(payload) {
  return {
    type: types.POLL_LOGS_FAILED,
    payload,
  }
}

export { pollLogsFailed, pollLogsStart, pollLogsSucceeded }
