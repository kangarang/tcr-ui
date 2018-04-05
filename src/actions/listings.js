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
