import _ from 'lodash/fp'

const SET_LISTINGS = 'SET_LISTINGS--Listings'
const UPDATE_LISTING = 'UPDATE_LISTING--Listings'
const DELETE_KEY = 'DELETE_KEY--Listings'

export function updateListing(payload) {
  return {
    type: UPDATE_LISTING,
    payload,
  }
}
export function setListings(payload) {
  return {
    type: SET_LISTINGS,
    payload,
  }
}
export function deleteKey(key) {
  return {
    type: DELETE_KEY,
    key,
  }
}

const initialState = {
  listings: {},
  byID: [],
}

function listingsReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_LISTING:
      return {
        ...state,
        listings: {
          ...state.listings,
          [action.payload.listingHash]: action.payload,
        },
      }
    case SET_LISTINGS:
      return {
        ...state,
        listings: {
          ...state.listings,
          ...action.payload.listings,
        },
        byID: [...state.byID, ...action.payload.byID],
      }
    case DELETE_KEY:
      return _.omit(action.key, state)
    default:
      return state
  }
}

export default listingsReducer
