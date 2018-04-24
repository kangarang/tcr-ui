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
function pollApplicationLogsSucceeded(payload) {
  return {
    type: types.FRESH_APPLICATIONS,
    payload,
  }
}

export { pollLogsFailed, pollLogsStart, pollLogsSucceeded, pollApplicationLogsSucceeded }
