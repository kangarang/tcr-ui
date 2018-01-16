import { fromJS } from 'immutable'

import {
  UDAPP_ERROR,
  SET_METHOD_ARGS,
  CHANGE_SLIDER_VALUE,
} from '../actions/constants'

const initialState = fromJS({
  error: false,
  tokenBalance: '',
  ethBalance: '',
  sliderValue: '',
})

function udappReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_SLIDER_VALUE:
      return state
        .set('sliderValue', fromJS(action))
    case SET_METHOD_ARGS:
      return state
        .setIn([action.method, action.input.name], fromJS(action.args))
    case UDAPP_ERROR:
      return state
        .set('error', fromJS(action.error))
    default:
      return state
  }
}

export default udappReducer