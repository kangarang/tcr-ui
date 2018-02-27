import { fromJS } from 'immutable'

import { UDAPP_ERROR, CHANGE_SLIDER_VALUE } from '../actions/constants'

const initialState = fromJS({
  error: false,
  sliderValue: '',
})

function udappReducer(state = initialState, action) {
  switch (action.type) {
    case UDAPP_ERROR:
      return state.set('error', fromJS(action.error))
    case CHANGE_SLIDER_VALUE:
      return state.set('sliderValue', fromJS(action))
    default:
      return state
  }
}

export default udappReducer
