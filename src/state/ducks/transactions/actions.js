import types from './types'

const sendTransactionStart = payload => ({
  type: types.SEND_TRANSACTION_START,
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
const txnMining = payload => ({
  type: types.TXN_MINING,
  payload,
})
const clearTxn = payload => ({
  type: types.CLEAR_TXN,
  payload,
})
export default {
  sendTransactionStart,
  sendTransactionSucceeded,
  sendTransactionFailed,
  txnMining,
  clearTxn,
}
