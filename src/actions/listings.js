export const SET_LISTINGS = 'SET_LISTINGS--Listings'
export const UPDATE_LISTING = 'UPDATE_LISTING--Listings'
export const DELETE_KEY = 'DELETE_KEY--Listings'

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
