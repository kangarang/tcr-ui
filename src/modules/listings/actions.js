import * as types from './types'

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

const openSidePanel = (listing, methodName) => ({
  type: types.OPEN_SIDE_PANEL,
  listing,
  methodName,
})

export { updateListing, setListings, deleteKey, openSidePanel }
