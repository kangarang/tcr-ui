import { createSelector } from 'reselect'
import pickBy from 'lodash/fp/pickBy'

export const selectHome = state => state.get('home')

export const selectError = createSelector(selectHome, homeState => homeState.get('error'))

export const selectAccount = createSelector(selectHome, homeState => homeState.get('account'))
export const selectNetwork = createSelector(selectHome, homeState => homeState.get('network'))
export const selectBalances = createSelector(selectHome, homeState => homeState.get('balances'))

export const selectTCR = createSelector(selectHome, homeState => homeState.get('tcr'))
export const selectParameters = createSelector(selectHome, homeState => homeState.get('parameters'))

export const selectABIs = createSelector(selectHome, homeState => homeState.get('abis'))
export const selectAllContracts = createSelector(selectHome, homeState =>
  homeState.get('contracts')
)
export const selectRegistry = createSelector(selectAllContracts, contracts =>
  contracts.get('registry')
)
export const selectToken = createSelector(selectAllContracts, contracts => contracts.get('token'))
export const selectVoting = createSelector(selectAllContracts, contracts => contracts.get('voting'))
export const selectParameterizer = createSelector(selectAllContracts, contracts =>
  contracts.get('parameterizer')
)

export const selectAllListings = createSelector(selectHome, homeState => homeState.get('listings'))

export const selectWhitelist = createSelector(
  selectAllListings,
  listings => listings.filter(li => li.get('status') === '3')
  // pickBy(li => li.get('status') === '3', listings)
)
export const onlyWhitelistIDs = createSelector(selectWhitelist, whitelist => {
  const [...keys] = whitelist.keys()
  return keys
})
export const selectCandidates = createSelector(
  selectAllListings,
  listings => listings.filter(li => li.get('status') === '1')
  // pickBy(li => li.get('status') === '1', listings)
)
export const onlyCandidateIDs = createSelector(selectCandidates, candidates => {
  const [...keys] = candidates.keys()
  return keys
})
export const selectFaceoffs = createSelector(
  selectAllListings,
  listings => listings.filter(li => li.get('status') === '2')
  // pickBy(li => li.get('status') === '2', listings)
)
export const onlyFaceoffIDs = createSelector(selectFaceoffs, faceoffs => {
  const [...keys] = faceoffs.keys()
  return keys
})

export const selectStats = createSelector(
  [selectCandidates, selectWhitelist, selectFaceoffs],
  (candidates, whitelist, faceoffs) => {
    return {
      sizes: {
        candidates: candidates.size,
        whitelist: whitelist.size,
        faceoffs: faceoffs.size,
      },
    }
  }
)
