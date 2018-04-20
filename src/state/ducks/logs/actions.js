import types from './types'

function pollLogsStart(payload) {
  return {
    type: types.POLL_LOGS_START,
    payload,
  }
}
export default {
  pollLogsStart,
}
