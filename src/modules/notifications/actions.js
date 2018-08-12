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
