import { fromJS } from 'immutable'

import {
  UDAPP_ERROR,
  SET_FROM_ADDRESS,
} from '../actions/constants'

const initialState = fromJS({
  error: false,
  provider: {},
  fromAddress: '',
  address: '',
  domain: '',
  deposit: '',
  tokenBalance: '',
  ethBalance: '',
})

function udappReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FROM_ADDRESS:
      return state
        .set('fromAddress', fromJS(action.fromAddress))
    case UDAPP_ERROR:
      return state
        .set('error', fromJS(action.error))
    default:
      return state
  }
}

export default udappReducer