import { createSelector } from 'reselect'

export const selectHome = state => state.get('home')

export const selectError = createSelector(selectHome, homeState =>
  homeState.get('error')
)
export const selectTxnStatus = createSelector(selectHome, homeState =>
  homeState.get('txnStatus')
)

export const selectEthjs = createSelector(selectHome, homeState =>
  homeState.get('ethjs')
)
export const selectAccount = createSelector(selectHome, homeState =>
  homeState.get('account')
)
export const selectMiningStatus = createSelector(selectHome, homeState =>
  homeState.get('miningStatus')
)
export const selectNetwork = createSelector(selectHome, homeState =>
  homeState.get('network')
)

// Balances
export const selectBalances = createSelector(selectHome, homeState =>
  homeState.get('balances')
)

// Contracts
export const selectAllContracts = createSelector(selectHome, homeState =>
  homeState.get('contracts')
)
export const selectRegistry = createSelector(selectAllContracts, contracts =>
  contracts.get('registry')
)
export const selectToken = createSelector(selectAllContracts, contracts =>
  contracts.get('token')
)
export const selectVoting = createSelector(selectAllContracts, contracts =>
  contracts.get('voting')
)
export const selectParameterizer = createSelector(
  selectAllContracts,
  contracts => contracts.get('parameterizer')
)

export const selectVotingMethods = createSelector(selectVoting, voting =>
  (voting ? voting.abi : []).filter(
    mi => mi.type === 'function' && mi.inputs.length > 0 && mi.constant
  )
)
export const selectRegistryMethods = createSelector(selectRegistry, registry =>
  (registry ? registry.abi : []).filter(
    mi => mi.type === 'function' && mi.inputs.length > 0 && mi.constant
  )
)
export const selectTokenMethods = createSelector(selectToken, token =>
  (token ? token.abi : []).filter(
    mi => mi.type === 'function' && mi.inputs.length > 0 && mi.constant
  )
)
export const selectVisibilityFilter = createSelector(selectHome, homeState =>
  homeState.get('vFilter')
)
export const selectVisibleRegistryMethod = createSelector(
  [selectRegistryMethods, selectVisibilityFilter],
  (registryMethods, vFilter) =>
    registryMethods.filter(rMeth => rMeth.name === vFilter)
)
export const selectVisibleVotingMethod = createSelector(
  [selectVotingMethods, selectVisibilityFilter],
  (votingMethods, vFilter) =>
    votingMethods.filter(vMeth => vMeth.name === vFilter)
)
export const selectVisibleTokenMethod = createSelector(
  [selectTokenMethods, selectVisibilityFilter],
  (tokenMethods, vFilter) =>
    tokenMethods.filter(tMeth => tMeth.name === vFilter)
)

// Parameters
export const selectParameters = createSelector(selectHome, homeState =>
  homeState.get('parameters')
)

// Listings
export const selectAllListings = createSelector(selectHome, homeState =>
  homeState.get('listings')
)
// Candidate listings
export const selectCandidates = createSelector(selectAllListings, listings =>
  listings.filter(
    li =>
      !li.get('whitelisted') &&
      li.get('data') &&
      !li.getIn(['latest', 'pollID']) &&
      !li.getIn(['latest', 'event']).includes('Removed')
  )
)
// Only voteable listings
export const selectFaceoffs = createSelector(selectAllListings, listings =>
  listings.filter(
    li =>
      !li.get('whitelisted') &&
      li.get('data') &&
      li.getIn(['latest', 'pollID']) &&
      !li.getIn(['latest', 'event']).includes('Removed')
  )
)
// Only whitelisted listings
export const selectWhitelist = createSelector(selectAllListings, listings =>
  listings.filter(
    li =>
      li.get('whitelisted') &&
      li.get('data') &&
      !li.getIn(['latest', 'event']).includes('Removed')
  )
)
