import { fromJS } from 'immutable'

import { UDAPP_ERROR } from '../actions/constants'

const initialState = fromJS({
  error: false,
  sliderValue: '',
})

function udappReducer(state = initialState, action) {
  switch (action.type) {
    case UDAPP_ERROR:
      return state.set('error', fromJS(action.error))
    default:
      return state
  }
}

export default udappReducer
