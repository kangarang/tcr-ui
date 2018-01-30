import { createSelector } from 'reselect'

export const selectHome = state => state.get('home')

export const selectParameters = createSelector(
  selectHome, homeState => homeState.get('parameters')
)
export const selectError = createSelector(
  selectHome, homeState => homeState.get('error')
)
export const selectWallet = createSelector(
  selectHome, homeState => homeState.get('wallet')
)
export const selectECRecovered = createSelector(
  selectHome, homeState =>
    homeState.get('ecRecovered')
)
export const selectContracts = createSelector(
  selectHome, homeState =>
    homeState.get('contracts')
)

export const selectCustomMethods = createSelector(
  selectHome, homeState =>
    homeState.get('customMethods')
)
export const selectServices = createSelector(
  selectHome, homeState =>
    homeState.get('services')
)

export const selectEthjs = createSelector(
  selectHome, homeState =>
    homeState.get('ethjs')
)

export const selectService = (service) => createSelector(
  [selectHome, selectServices], (homeState, services) =>
    homeState.getIn([services, service])
)
export const selectAccount = createSelector(
  selectWallet, wallet =>
    wallet.get('address')
)

// All listings
export const selectAllListings = createSelector(
  selectHome, homeState =>
    homeState.get('listings')
)
// export const selectPollID = createSelector(
//   selectAllListings, listings =>
//     listings.get('pollID')
// )

// Candidate listings
export const selectCandidates = createSelector(
  selectAllListings, listings =>
    listings.filter(li => (
      (!li.getIn(['latest', 'whitelisted']) && !li.getIn(['latest', 'pollID']))
    ))
)

// Only voteable listings
export const selectFaceoffs = createSelector(
  selectAllListings, listings =>
    listings.filter(li => (
      (!li.getIn(['latest', 'whitelisted']) && li.getIn(['latest', 'pollID']))
    ))
)

// Only whitelisted listings
export const selectWhitelist = createSelector(
  selectAllListings, listings =>
    listings.filter(li => li.getIn(['latest', 'whitelisted']))
)
