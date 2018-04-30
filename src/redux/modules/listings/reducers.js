import { fromJS } from 'immutable'

import * as types from './types'

const initialState = fromJS({
  listings: {},
  byID: [],
  sidePanelListing: {},
  sidePanelMethod: '',
})

function listingsReducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_LISTINGS:
      return state.set('listings', fromJS(action.payload))
    case types.UPDATE_LISTING:
      return state.setIn(['listings', action.payload.listingHash], fromJS(action.payload))
    case types.OPEN_SIDE_PANEL:
      return state
        .set('sidePanelListing', fromJS(action.listing))
        .set('sidePanelMethod', fromJS(action.methodName))
    // case types.DELETE_KEY:
    //   return omit(action.key, state)
    default:
      return state
  }
}

export default listingsReducer
