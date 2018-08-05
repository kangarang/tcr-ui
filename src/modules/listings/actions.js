import * as types from './types'

const updateOneListing = listing => ({
  type: types.UPDATE_ONE_LISTING,
  listing,
})

const setListings = listings => ({
  type: types.SET_LISTINGS,
  listings,
})

const deleteKey = key => ({
  type: types.DELETE_KEY,
  key,
})

export { updateOneListing, setListings, deleteKey }
