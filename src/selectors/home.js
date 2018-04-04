import { createSelector } from 'reselect'

export const selectHome = state => state.home

export const selectError = createSelector(selectHome, homeState => homeState.error)
export const selectProvider = createSelector(selectHome, homeState => homeState.provider)
export const selectAccount = createSelector(selectHome, homeState => homeState.account)
export const selectNetwork = createSelector(selectHome, homeState => homeState.network)
export const selectBalances = createSelector(selectHome, homeState => homeState.balances)
export const selectParameters = createSelector(selectHome, homeState => homeState.parameters)
export const selectTCR = createSelector(selectHome, homeState => homeState.tcr)

// Contracts
export const selectAllContracts = createSelector(selectHome, homeState => homeState.contracts)
export const selectRegistry = createSelector(selectAllContracts, contracts => contracts.registry)
export const selectToken = createSelector(selectAllContracts, contracts => contracts.token)
export const selectVoting = createSelector(selectAllContracts, contracts => contracts.voting)
export const selectParameterizer = createSelector(
  selectAllContracts,
  contracts => contracts.parameterizer
)
