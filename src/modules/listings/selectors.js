import { createSelector } from 'reselect'

export const selectListings = state => state.get('listings')

// Map(Maps)
export const selectAllListings = createSelector(selectListings, listingsState =>
  listingsState.get('listings')
)

// Maps
export const selectApplications = createSelector(selectAllListings, listings =>
  listings.filter(li => li.get('status') === '1')
)
export const selectFaceoffs = createSelector(selectAllListings, listings =>
  listings.filter(li => li.get('status') === '2')
)
export const selectWhitelist = createSelector(selectAllListings, listings =>
  listings.filter(li => li.get('status') === '3')
)
export const selectExpired = createSelector(selectAllListings, listings =>
  listings.filter(li => li.get('status') === '4')
)
export const selectTokensToClaim = createSelector(selectAllListings, listings =>
  listings.filter(li => li.get('tokensToClaim') === true)
)

// export const selectRewardable = createSelector(selectExpired, listings =>
//   listings.filter(li => li.get())
// )

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
