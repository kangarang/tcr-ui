import { createSelector } from 'reselect'

export const selectHome = state => state.get('home')

export const selectParameters = createSelector(
  selectHome, homeState => homeState.get('parameters')
)
export const selectAccount = createSelector(
  selectParameters, parameters =>
    parameters.getIn(['ethereum', 'address'])
)

// All listings
export const selectAllListings = createSelector(
  selectHome, homeState =>
    homeState.getIn(['listings', 'byDomain'])
)
export const selectPollID = createSelector(
  selectAllListings, listings =>
    listings.get('pollID')
)

// Candidate listings
export const makeSelectCandidates = () =>
  createSelector(selectAllListings, listings =>
    listings.filter(li => (
      (li.get('whitelisted') === false && !li.getIn(['golem', 'pollID']))
    ))
  )

// Only voteable listings
export const selectFaceoffs = createSelector(
  selectAllListings, listings =>
    listings.filter(li => (
      (!li.getIn(['golem', 'pollID']) && li.getIn(['golem', 'pollID']))
    ))
)

// Only whitelisted listings
export const selectWhitelist = createSelector(
  selectAllListings, listings =>
    listings.filter(li => li.get('whitelisted'))
)
