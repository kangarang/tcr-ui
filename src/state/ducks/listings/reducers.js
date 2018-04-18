import { fromJS } from 'immutable'

import types from './types'

const initialState = fromJS({
  listings: {},
  byID: [],
})

function listingsReducer(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_LISTING:
      return state.setIn(['listings', action.payload.listingHash], fromJS(action.payload))
    case types.SET_LISTINGS:
      return state
        .set('listings', fromJS(action.payload.listings))
        .set('byID', fromJS(action.payload.byID))
    // case types.DELETE_KEY:
    // return omit(action.key, state)
    default:
      return state
  }
}

export default listingsReducer
