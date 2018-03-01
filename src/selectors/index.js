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
export const selectNetworkID = createSelector(selectHome, homeState =>
  homeState.get('networkID')
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
export const selectParameterizer = createSelector(selectAllContracts, contracts =>
  contracts.get('parameterizer')
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

// export const selectECRecovered = createSelector(selectHome, homeState =>
//   homeState.get('ecRecovered')
// )
// export const selectPrerequisites = createSelector(selectHome, homeState =>
//   homeState.get('prerequisites')
// )