import { fromJS } from 'immutable'

import * as types from './types'

const initialState = fromJS({
  listings: {},
  byID: [],
})

function listingsReducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_ALL_LISTINGS:
      return state
        .set('listings', fromJS(action.listings))
        .set('byID', fromJS(fromJS(action.listings).keySeq()))
    case types.UPDATE_ONE_LISTING:
      return state.setIn(['listings', action.listing.listingHash], fromJS(action.listing))
    default:
      return state
  }
}

export default listingsReducer
