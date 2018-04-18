import omit from 'lodash/fp/omit'
import { fromJS } from 'immutable'

import types from './types'

const initialState = fromJS({
  listings: {},
  byID: [],
})

function listingsReducer(state = initialState, action) {
  switch (action.type) {
    // case types.UPDATE_LISTING:
    // return {
    //   ...state,
    //   listings: {
    //     ...state.listings,
    //     [action.payload.listingHash]: action.payload,
    //   },
    // }
    // case types.SET_LISTINGS:
    // return {
    //   ...state,
    //   listings: {
    //     ...state.listings,
    //     ...action.payload.listings,
    //   },
    //   byID: [...state.byID, ...action.payload.byID],
    // }
    // case types.DELETE_KEY:
    // return omit(action.key, state)
    default:
      return state
  }
}

export default listingsReducer

// const updateUser = user =>
//   Object.assign({}, user, {
//     name: user.name.charAt(0).toUpperCase() + user.name.slice(1),
//   })
// const byId = state =>
//   state.reduce(
//     (acc, item) => ({
//       ...acc,
//       [item.id]: updateUser(item),
//     }),
//     {}
//   )
// const usersById = byId(listings)
