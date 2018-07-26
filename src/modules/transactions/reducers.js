import { fromJS } from 'immutable'
import * as types from './types'

const initialState = fromJS({
  error: false,
  miningStatus: false,
  latestTxn: { transactionHash: '' },
  toAddress: '',
  numTokens: '',
  data: '',
  salt: '',
  voteOption: '',
})

export default (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_TXN_INPUT:
      return state.set(action.payload.inputType, fromJS(action.payload.inputValue))
    case types.TXN_MINING:
      return state
        .set('miningStatus', fromJS(true))
        .setIn(['latestTxn', 'transactionHash'], fromJS(action.payload))
    case types.SEND_TRANSACTION_SUCCEEDED:
      return state.set('latestTxn', fromJS(action.payload))
    case types.SEND_TRANSACTION_FAILED:
      return state.set('error', fromJS(action.payload.error))
    case types.CLEAR_TXN:
      return state
        .set('miningStatus', fromJS(false))
        .set('latestTxn', fromJS({ transactionHash: '' }))
    default:
      return state
  }
}
