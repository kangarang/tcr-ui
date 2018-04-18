import types from './types'

const initialState = {
  miningStatus: false,
  latestTxn: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.TXN_MINING:
      return {
        ...state,
        miningStatus: true,
        latestTxn: action.payload,
      }
    case types.TXN_MINED:
      return {
        ...state,
        latestTxn: action.payload,
      }
    case types.CLEAR_TXN:
      return {
        ...state,
        miningStatus: false,
        latestTxn: false,
      }
    default:
      return state
  }
}
