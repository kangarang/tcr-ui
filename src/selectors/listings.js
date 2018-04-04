import { createSelector } from 'reselect'
import _ from 'lodash'

export const selectListings = state => state.listings

export const selectAllListings = createSelector(
  selectListings,
  listingsState => listingsState.listings
)

// Only whitelisted listings
export const selectWhitelist = createSelector(selectAllListings, listings =>
  _.pickBy(listings, li => li.status === '3')
)
// Candidate listings
export const selectCandidates = createSelector(selectAllListings, listings =>
  _.pickBy(listings, li => li.status === '1')
)
// Only voteable listings
export const selectFaceoffs = createSelector(selectAllListings, listings =>
  _.pickBy(listings, li => li.status === '2')
)

export const selectRemoved = createSelector(selectAllListings, listings =>
  _.pickBy(listings, li => li.status === '0')
)
