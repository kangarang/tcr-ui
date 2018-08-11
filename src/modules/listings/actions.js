import * as types from './types'

const updateOneListing = listing => ({
  type: types.UPDATE_ONE_LISTING,
  listing,
})

const setAllListings = (listings, byID) => ({
  type: types.SET_ALL_LISTINGS,
  listings,
  byID,
})

const deleteOneListing = key => ({
  type: types.DELETE_ONE_LISTING,
  key,
})

export { updateOneListing, setAllListings, deleteOneListing }
