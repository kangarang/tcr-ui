import { createSelector } from 'reselect'

export const selectListings = state => state.get('listings')

// Map(Maps)
export const selectAllListings = createSelector(selectListings, listingsState =>
  listingsState.get('listings')
)

// Maps
export const selectApplications = createSelector(selectAllListings, listings =>
  listings.filter(li => li.get('status') === 'applications')
)
export const selectFaceoffs = createSelector(selectAllListings, listings =>
  listings.filter(li => li.get('status') === 'faceoffs')
)
export const selectWhitelist = createSelector(selectAllListings, listings =>
  listings.filter(li => li.get('status') === 'whitelist')
)
export const selectRemoved = createSelector(selectAllListings, listings =>
  listings.filter(li => li.get('status') === 'removed')
)
export const selectExpired = createSelector(selectAllListings, listings =>
  listings.filter(li => li.get('status') === 'expired')
)
export const selectTokensToClaim = createSelector(selectAllListings, listings =>
  listings.filter(li => li.get('tokensToClaim') === true)
)
// component reads filter value through props, not from state
// selector will recompute when the filter changes
export const makeSelectVisibleListings = () =>
  createSelector(
    selectAllListings,
    (state, ownProps) => ownProps.filter,
    (listings, filter) => listings.filter(li => li.get('status') === filter)
  )

// IDs
export const onlyApplicationIDs = createSelector(selectApplications, applications => {
  const [...keys] = applications.keys()
  return keys
})
export const onlyFaceoffIDs = createSelector(selectFaceoffs, faceoffs => {
  const [...keys] = faceoffs.keys()
  return keys
})
export const onlyWhitelistIDs = createSelector(selectWhitelist, whitelist => {
  const [...keys] = whitelist.keys()
  return keys
})

export const onlyExpiredIDs = createSelector(selectExpired, expired => {
  const [...keys] = expired.keys()
  return keys
})

export const selectSidePanelListing = createSelector(selectListings, listingsState =>
  listingsState.get('sidePanelListing')
)
export const selectSidePanelMethod = createSelector(selectListings, listingsState =>
  listingsState.get('sidePanelMethod')
)
