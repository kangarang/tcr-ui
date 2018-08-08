import * as types from './types'

const sendTransactionStart = payload => ({
  type: types.SEND_TRANSACTION_START,
  payload,
})
const sendTransactionPending = payload => ({
  type: types.SEND_TRANSACTION_PENDING,
  payload,
})
const sendTransactionSucceeded = payload => ({
  type: types.SEND_TRANSACTION_SUCCEEDED,
  payload,
})
const sendTransactionFailed = payload => ({
  type: types.SEND_TRANSACTION_FAILED,
  payload,
})
const openTxPanel = (listing, methodName) => ({
  type: types.OPEN_TX_PANEL,
  listing,
  methodName,
})

export {
  sendTransactionStart,
  sendTransactionPending,
  sendTransactionSucceeded,
  sendTransactionFailed,
  openTxPanel,
}
