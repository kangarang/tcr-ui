import { createSelector } from 'reselect'
// import pickBy from 'lodash/fp/pickBy'
// import filter from 'lodash/fp/filter'
// import flow from 'lodash/fp/flow'

export const selectListings = state => state.get('listings')

export const selectAllListings = createSelector(selectListings, listingState =>
  listingState.get('listings')
)

// const onlyThrees = filter(li => li.status === '3')
// const onlyTwos = filter(li => li.status === '2')
// const onlyOnes = filter(li => li.status === '1')

// filter(onlyThrees, listings)
// Only whitelisted listings
export const selectWhitelist = createSelector(
  selectAllListings,
  listings => listings.filter(li => li.get('status') === '3')
  // pickBy(li => li.get('status') === '3', listings)
)
// Candidate listings
export const selectCandidates = createSelector(
  selectAllListings,
  listings =>
    // listings => pickBy(li => li.get('status') === '1', listings)
    listings.filter(li => li.get('status') === '1')
  // listings.filter(li => li.status === '1')
)
// Only voteable listings
export const selectFaceoffs = createSelector(selectAllListings, listings =>
  // pickBy(li => li.get('status') === '2', listings)
  listings.filter(li => li.get('status') === '2')
)

export const selectRemoved = createSelector(selectAllListings, listings =>
  // pickBy(li => li.get('status') === '0', listings)
  listings.filter(li => li.get('status') === '0')
)
