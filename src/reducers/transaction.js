import { fromJS } from 'immutable'

import { SEND_TRANSACTION, TXN_MINED, TXN_REVERTED } from '../actions/constants'

const initialState = fromJS({
  miningStatus: false,
})

export default (state = initialState, action) => {
  switch (action.type) {
    case SEND_TRANSACTION:
      return state.set('miningStatus', fromJS(true))
    // case TXN_MINED:
    //   return state
    //     .setIn(['txnStatus', 'open'], fromJS(false))
    //     .setIn(['txnStatus', 'message'], fromJS(action.payload.message))
    // case TXN_REVERTED:
    //   return state
    //     .setIn(['txnStatus', 'open'], fromJS(false))
    //     .setIn(['txnStatus', 'message'], fromJS(action.payload.message))
    default:
      return state
  }
}
