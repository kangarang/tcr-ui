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
export const selectPrerequisites = createSelector(
  selectHome, homeState =>
    homeState.get('prerequisites')
)
export const selectNetwork = createSelector(
  selectHome, homeState =>
    homeState.getIn(['wallet', 'network'])
)
export const selectContracts = createSelector(
  selectHome, homeState =>
    homeState.get('contracts')
)

export const selectContract = (c) => createSelector(
  selectContracts, contracts =>
  contracts.get(c)
)
export const selectRequest = createSelector(
  selectHome, homeState =>
    homeState.get('request')
)
export const selectUDappMethods = createSelector(
  selectHome, homeState => homeState.get('udappMethods')
)
export const selectAbi = (contract) => createSelector(
  [selectHome, selectContracts], (homeState, contracts) => contracts.getIn([contract, 'abi'])
)

export const selectCustomMethods = createSelector(
  [selectUDappMethods, selectRequest],
  (udappMethods, requestedMethods) =>
    udappMethods.filter(meth => meth.name === requestedMethods.get('method'))
)

export const selectEthjs = createSelector(
  selectHome, homeState =>
    homeState.get('ethjs')
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
