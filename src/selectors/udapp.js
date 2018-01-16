import { createSelector } from 'reselect'
import {
  selectAllListings,
  selectCandidates,
  selectFaceoffs,
} from './index'

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

export const selectSliderValue = createSelector(
  selectUdapp, udappState => udappState.get('sliderValue')
)
export const selectValues = createSelector(
  selectUdapp, udappState => udappState.get('values')
)
// export const selectAbi = createSelector(
//   selectUdapp, udappState => udappState.get('abi')
// )
// export const selectVisibleMethods = createSelector(
//   selectUdapp, udappState => udappState.get('values')
// )
// export const selectEvents = createSelector(
//   selectAbi, abis => abis.filter((a) => a.type === 'event')
// )
