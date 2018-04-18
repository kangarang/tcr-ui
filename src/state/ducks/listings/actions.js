import types from './types'

const updateListing = payload => ({
  type: types.UPDATE_LISTING,
  payload,
})

const setListings = payload => ({
  type: types.SET_LISTINGS,
  payload,
})

const deleteKey = key => ({
  type: types.DELETE_KEY,
  key,
})

export default {
  updateListing,
  setListings,
  deleteKey,
}
