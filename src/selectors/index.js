import { createSelector } from 'reselect'

export const selectHome = state => state.get('home')

export const selectError = createSelector(selectHome, homeState =>
  homeState.get('error')
)
export const selectParameters = createSelector(selectHome, homeState =>
  homeState.get('parameters')
)
export const selectECRecovered = createSelector(selectHome, homeState =>
  homeState.get('ecRecovered')
)
export const selectPrerequisites = createSelector(selectHome, homeState =>
  homeState.get('prerequisites')
)

// Ethjs
export const selectEthjs = createSelector(selectHome, homeState =>
  homeState.get('ethjs')
)

// Wallet
export const selectWallet = createSelector(selectHome, homeState =>
  homeState.get('wallet')
)
export const selectNetwork = createSelector(selectWallet, wallet =>
  wallet.get('network')
)
export const selectAccount = createSelector(selectWallet, wallet =>
  wallet.get('account')
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
export const selectParameterizer = createSelector(selectAllContracts, contracts =>
  contracts.get('parameterizer')
)

export const selectRequest = createSelector(selectHome, homeState =>
  homeState.get('request')
)
export const selectUDappMethods = createSelector(selectHome, homeState =>
  homeState.get('udappMethods')
)


// All listings
export const selectAllListings = createSelector(selectHome, homeState =>
  homeState.get('listings')
)
// Candidate listings
export const selectCandidates = createSelector(selectAllListings, listings =>
  listings.filter(
    li =>
      !li.getIn(['latest', 'whitelisted']) && !li.getIn(['latest', 'pollID'])
  )
)
// Only voteable listings
export const selectFaceoffs = createSelector(selectAllListings, listings =>
  listings.filter(
    li => !li.getIn(['latest', 'whitelisted']) && li.getIn(['latest', 'pollID'])
  )
)
// Only whitelisted listings
export const selectWhitelist = createSelector(selectAllListings, listings =>
  listings.filter(li => li.getIn(['latest', 'whitelisted']))
)
