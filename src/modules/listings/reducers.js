import { fromJS } from 'immutable'

import * as types from './types'
import { OPEN_SIDE_PANEL } from 'modules/transactions/types'

const initialState = fromJS({
  byID: [],
  listings: {},
  sidePanelListing: {},
  sidePanelMethod: '',
})

function listingsReducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_LISTINGS:
      return state.set('listings', fromJS(action.listings))
    case types.UPDATE_ONE_LISTING:
      return state.setIn(['listings', action.listing.listingHash], fromJS(action.listing))
    case OPEN_SIDE_PANEL:
      return state
        .set('sidePanelListing', fromJS(action.listing))
        .set('sidePanelMethod', fromJS(action.methodName))
    default:
      return state
  }
}

export default listingsReducer
