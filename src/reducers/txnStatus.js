import { fromJS } from 'immutable'

import {
  SEND_TRANSACTION,
  TXN_MINED,
  TXN_REVERTED,
} from '../actions/constants'

const initialState = fromJS({
  txnStatus: {
    open: false,
    message: '',
  },
})

export default (state, action) => {
  switch (action.type) {
    case SEND_TRANSACTION:
      return state
        .setIn(['txnStatus', 'open'], fromJS(true))
        .setIn(['txnStatus', 'message'], fromJS(action.payload.message))
    case TXN_MINED:
      return state
        .setIn(['txnStatus', 'open'], fromJS(false))
        .setIn(['txnStatus', 'message'], fromJS(action.payload.message))
    case TXN_REVERTED:
      return state
        .setIn(['txnStatus', 'open'], fromJS(false))
        .setIn(['txnStatus', 'message'], fromJS(action.payload.message))
    default:
      return state
  }
}
