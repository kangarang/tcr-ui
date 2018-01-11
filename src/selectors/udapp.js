import { createSelector } from 'reselect'

export const selectUdapp = state => state.get('udapp')

export const selectTokenBalance = createSelector(
  selectUdapp, udappState => udappState.get('tokenBalance')
)
export const selectEthBalance = createSelector(
  selectUdapp, udappState => udappState.get('ethBalance')
)
export const selectProvider = createSelector(
  selectUdapp, udappState => udappState.get('provider')
)
export const selectFromAddress = createSelector(
  selectUdapp, udappState => udappState.get('fromAddress')
)
export const selectAddress = createSelector(
  selectUdapp, udappState => udappState.get('address')
)
export const selectDeposit = createSelector(
  selectUdapp, udappState => udappState.get('deposit')
)
export const selectValues = createSelector(
  selectUdapp, udappState => udappState.get('values')
)
export const selectAbi = createSelector(
  selectUdapp, udappState => udappState.get('abi')
)

export const selectEvents = createSelector(
  selectAbi, abis => abis.filter((a) => a.type === 'event')
)
