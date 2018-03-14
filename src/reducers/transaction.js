import { fromJS } from 'immutable'

import { TXN_MINED, TXN_MINING, CLEAR_TXN } from '../actions/constants'

const initialState = fromJS({
  miningStatus: false,
  latestTxn: {},
})

export default (state = initialState, action) => {
  switch (action.type) {
    case TXN_MINING:
      return state.set('miningStatus', fromJS(true))
    case TXN_MINED:
      return state.set('latestTxn', fromJS(action.payload))
    case CLEAR_TXN:
      return state
        .set('miningStatus', fromJS(false))
        .set('latestTxn', fromJS({}))
    default:
      return state
  }
}
