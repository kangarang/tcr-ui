import { createSelector } from 'reselect'
import { selectAllListings, selectCandidates, selectFaceoffs } from './index'

export const selectUdapp = state => state.get('udapp')

export const selectTokenBalance = createSelector(selectUdapp, udappState =>
  udappState.get('tokenBalance')
)
export const selectEthBalance = createSelector(selectUdapp, udappState =>
  udappState.get('ethBalance')
)

export const selectSliderValue = createSelector(selectUdapp, udappState =>
  udappState.get('sliderValue')
)
