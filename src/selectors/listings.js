import { createSelector } from 'reselect'
import _ from 'lodash/fp'

export const selectListings = state => state.listings

// Only whitelisted listings
export const selectWhitelist = createSelector(selectListings, listings =>
  _.pickBy(li => li.status === '3', listings)
)
// Candidate listings
export const selectCandidates = createSelector(
  selectListings,
  listings => _.pickBy(li => li.status === '1', listings)
  // listings.filter(li => li.status === '1')
)
// Only voteable listings
export const selectFaceoffs = createSelector(selectListings, listings =>
  _.pickBy(li => li.status === '2', listings)
)

export const selectRemoved = createSelector(selectListings, listings =>
  _.pickBy(li => li.status === '0', listings)
)
