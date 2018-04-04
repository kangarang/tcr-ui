export const SEND_TRANSACTION = 'SEND_TRANSACTION--Tx'
export const TXN_MINING = 'TXN_MINING--Tx'
export const TXN_MINED = 'TXN_MINED--Tx'
export const CLEAR_TXN = 'CLEAR_TXN--Tx'
export const TX_REQUEST_VOTING_RIGHTS = 'TX_REQUEST_VOTING_RIGHTS--Tx'
export const TX_COMMIT_VOTE = 'TX_COMMIT_VOTE--Tx'
export const TX_REVEAL_VOTE = 'TX_REVEAL_VOTE--Tx'

export function sendTransaction(payload) {
  return {
    type: SEND_TRANSACTION,
    payload,
  }
}
export function txnMining(payload) {
  return {
    type: TXN_MINING,
    payload,
  }
}
export function txnMined(payload) {
  return {
    type: TXN_MINED,
    payload,
  }
}
export function clearTxn(payload) {
  return {
    type: CLEAR_TXN,
    payload,
  }
}

const initialState = {
  miningStatus: false,
  latestTxn: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case TXN_MINING:
      return {
        ...state,
        miningStatus: true,
        latestTxn: action.payload,
      }
    case TXN_MINED:
      return {
        ...state,
        latestTxn: action.payload,
      }
    case CLEAR_TXN:
      return {
        ...state,
        miningStatus: false,
        latestTxn: false,
      }
    default:
      return state
  }
}
