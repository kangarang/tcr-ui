import { fromJS } from 'immutable'
import * as types from './types'

const initialState = fromJS({
  decodedLogs: {},
})

function logsReducer(state = initialState, action) {
  switch (action.type) {
    case types.POLL_LOGS_SUCCEEDED:
      return state.set('decodedLogs', fromJS(action.payload))
    default:
      return state
  }
}

export default logsReducer

// In a large scale application, your state tree will be at least 3 level deep.
// Reducer functions should be as small as possible and handle only simple data constructs.
// The combineReducers utility function is all you need to build a flexible and maintainable state shape.
