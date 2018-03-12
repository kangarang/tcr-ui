import { fromJS } from 'immutable'

import { SEND_TRANSACTION, TXN_MINED, TXN_REVERTED } from '../actions/constants'

const initialState = fromJS({
  miningStatus: false,
})

export default (state = initialState, action) => {
  switch (action.type) {
    case SEND_TRANSACTION:
      return state.set('miningStatus', fromJS(true))
    case TXN_MINED:
      return state.set('miningStatus', fromJS(false))
    case TXN_REVERTED:
      return state.set('miningStatus', fromJS(false))
    default:
      return state
  }
}
