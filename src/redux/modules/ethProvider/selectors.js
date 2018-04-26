// import { createSelector } from 'reselect'
// import { selectCandidates, selectWhitelist, selectFaceoffs } from '../listings/selectors'

// export const selectEthProvider = state => state.get('ethProvider')
// export const selectNotifications = state => state.get('notifications')

// export const selectError = createSelector(selectEthProvider, ethProviderState =>
//   ethProviderState.get('error')
// )
// export const selectEthjs = createSelector(selectEthProvider, ethProviderState =>
//   ethProviderState.get('ethjs')
// )
// export const selectProvider = createSelector(selectEthProvider, ethProviderState =>
//   ethProviderState.get('provider')
// )
// export const selectAccount = createSelector(selectEthProvider, ethProviderState =>
//   ethProviderState.get('account')
// )
// export const selectNetwork = createSelector(selectEthProvider, ethProviderState =>
//   ethProviderState.get('network')
// )
// export const selectBalances = createSelector(selectEthProvider, ethProviderState =>
//   ethProviderState.get('balances')
// )
// export const selectParameters = createSelector(selectEthProvider, ethProviderState =>
//   ethProviderState.get('parameters')
// )
// export const selectTCR = createSelector(selectEthProvider, ethProviderState =>
//   ethProviderState.get('tcr')
// )
// export const selectABIs = createSelector(selectEthProvider, ethProviderState =>
//   ethProviderState.get('abis')
// )

// // Contracts
// export const selectAllContracts = createSelector(selectEthProvider, ethProviderState =>
//   ethProviderState.get('contracts')
// )
// export const selectRegistry = createSelector(selectAllContracts, contracts =>
//   contracts.get('registry')
// )
// export const selectToken = createSelector(selectAllContracts, contracts =>
//   contracts.get('token')
// )
// export const selectVoting = createSelector(selectAllContracts, contracts =>
//   contracts.get('voting')
// )
// export const selectParameterizer = createSelector(selectAllContracts, contracts =>
//   contracts.get('parameterizer')
// )
