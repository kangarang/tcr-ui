import { createSelector } from 'reselect'
import _ from 'lodash'

export const selectHome = state => state.home

export const selectError = createSelector(selectHome, homeState => homeState.error)
export const selectProvider = createSelector(selectHome, homeState => homeState.provider)
export const selectAccount = createSelector(selectHome, homeState => homeState.account)
export const selectNetwork = createSelector(selectHome, homeState => homeState.network)
export const selectBalances = createSelector(selectHome, homeState => homeState.balances)

// Contracts
export const selectAllContracts = createSelector(selectHome, homeState => homeState.contracts)
export const selectRegistry = createSelector(selectAllContracts, contracts => contracts.registry)
export const selectToken = createSelector(selectAllContracts, contracts => contracts.token)
export const selectVoting = createSelector(selectAllContracts, contracts => contracts.voting)
export const selectParameterizer = createSelector(
  selectAllContracts,
  contracts => contracts.parameterizer
)

// Parameters
export const selectParameters = createSelector(selectHome, homeState => homeState.parameters)
// Listings
export const selectAllListings = createSelector(selectHome, homeState => homeState.listings)

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

// export const selectRemoved = createSelector(selectAllListings, listings =>
// _.pickBy(listings, li => li.status === '0')
// )
