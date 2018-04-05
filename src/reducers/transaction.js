import { TXN_MINED, TXN_MINING, CLEAR_TXN } from 'actions/transaction'

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
