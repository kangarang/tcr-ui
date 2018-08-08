import { fromJS } from 'immutable'
import * as types from './types'

const initialState = fromJS({
  error: false,
  txPanelListing: {},
  txPanelMethod: '',
})

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SEND_TRANSACTION_FAILED:
      return state.set('error', fromJS(action.payload.error))
    case types.OPEN_TX_PANEL:
      return state
        .set('txPanelListing', fromJS(action.listing))
        .set('txPanelMethod', fromJS(action.methodName))
    default:
      return state
  }
}
