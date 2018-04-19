import { createSelector } from 'reselect'

export const selectEthereumProvider = state => state.get('ethereumProvider')

export const selectError = createSelector(selectEthereumProvider, ethereumProviderState =>
  ethereumProviderState.get('error')
)
export const selectEthjs = createSelector(selectEthereumProvider, ethereumProviderState =>
  ethereumProviderState.get('ethjs')
)
export const selectProvider = createSelector(selectEthereumProvider, ethereumProviderState =>
  ethereumProviderState.get('provider')
)
export const selectAccount = createSelector(selectEthereumProvider, ethereumProviderState =>
  ethereumProviderState.get('account')
)
export const selectNetwork = createSelector(selectEthereumProvider, ethereumProviderState =>
  ethereumProviderState.get('network')
)
export const selectBalances = createSelector(selectEthereumProvider, ethereumProviderState =>
  ethereumProviderState.get('balances')
)
export const selectParameters = createSelector(selectEthereumProvider, ethereumProviderState =>
  ethereumProviderState.get('parameters')
)
export const selectTCR = createSelector(selectEthereumProvider, ethereumProviderState =>
  ethereumProviderState.get('tcr')
)
export const selectABIs = createSelector(selectEthereumProvider, ethereumProviderState =>
  ethereumProviderState.get('abis')
)

// Contracts
export const selectAllContracts = createSelector(selectEthereumProvider, ethereumProviderState =>
  ethereumProviderState.get('contracts')
)
export const selectRegistry = createSelector(selectAllContracts, contracts =>
  contracts.get('registry')
)
export const selectToken = createSelector(selectAllContracts, contracts => contracts.get('token'))
export const selectVoting = createSelector(selectAllContracts, contracts => contracts.get('voting'))
export const selectParameterizer = createSelector(selectAllContracts, contracts =>
  contracts.get('parameterizer')
)
