import { createSelector } from 'reselect'

export const selectHome = state => state.get('home')

export const selectError = createSelector(selectHome, homeState => homeState.get('error'))
// export const selectEthjs = createSelector(selectHome, homeState => homeState.get('ethjs'))
export const selectProvider = createSelector(selectHome, homeState => homeState.get('provider'))
export const selectAccount = createSelector(selectHome, homeState => homeState.get('account'))
export const selectNetwork = createSelector(selectHome, homeState => homeState.get('network'))
export const selectBalances = createSelector(selectHome, homeState => homeState.get('balances'))
export const selectParameters = createSelector(selectHome, homeState => homeState.get('parameters'))
export const selectTCR = createSelector(selectHome, homeState => homeState.get('tcr'))
export const selectABIs = createSelector(selectHome, homeState => homeState.get('abis'))

// Contracts
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
