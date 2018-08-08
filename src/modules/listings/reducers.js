import { fromJS } from 'immutable'

import * as types from './types'

const initialState = fromJS({
  listings: {},
  byID: [],
})

function listingsReducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_LISTINGS:
      return state
        .set('listings', fromJS(action.listings))
        .set('byID', fromJS(action.byID))
    case types.UPDATE_ONE_LISTING:
      return state.setIn(['listings', action.listing.listingHash], fromJS(action.listing))
    default:
      return state
  }
}

export default listingsReducer
