import { SET_CONTRACTS } from "../actions/constants";

const TRANSACTION_SENT = 'TRANSACTION_SENT'
const TRANSACTION_MINED = 'TRANSACTION_MINED'

const initialState = {
  open: false,
  message: '',
  lastMinedTimestamp: 0,
}


export default (state = initialState, action) => {
  if (!action) return state
  switch (action.type) {
    // case TRANSACTION_SENT:
    case SET_CONTRACTS:
      return { ...state, open: true, message: 'CONTRACTS SETTT' }
    case TRANSACTION_MINED:
      return { ...state, open: false, message: '', lastMinedTimestamp: Date.now() }
    default:
      return state
  }
}

export const transactionSent = (_, message) => {
  return {
    type: TRANSACTION_SENT,
    message: message,
  }
}

export const transactionMined = (_) => {
  return {
    type: TRANSACTION_MINED,
  }
}