import { createSelector } from 'reselect'
import { selectCandidates, selectWhitelist, selectFaceoffs } from '../listings/selectors'

export const selectNotifications = state => state.get('notifications')

export const selectHome = state => state.get('home')

export const selectError = createSelector(selectHome, homeState => homeState.get('error'))

export const selectAccount = createSelector(selectHome, homeState =>
  homeState.get('account')
)
export const selectNetwork = createSelector(selectHome, homeState =>
  homeState.get('network')
)
export const selectBalances = createSelector(selectHome, homeState =>
  homeState.get('balances')
)

export const selectTCR = createSelector(selectHome, homeState => homeState.get('tcr'))
export const selectParameters = createSelector(selectHome, homeState =>
  homeState.get('parameters')
)

export const selectABIs = createSelector(selectHome, homeState => homeState.get('abis'))
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

// export const selectSortableData = createSelector(selectWhitelist, listings =>
//   listings.map(wl => ({
//     tokenIcon: wl.getIn(['tokenData', 'imgSrc']),
//     tokenSymbol: wl.getIn(['tokenData', 'symbol']),
//     tokenName: wl.getIn(['tokenData', 'name']),
//     trackerUrl: `https://etherscan.io/token/${wl.get('listingID')}`,
//     tokenSupply: wl.getIn(['tokenData', 'totalSupply']),
//     fiatPrice: wl.getIn(['tokenData', 'fiatPrice']),
//     marketCap: wl.getIn(['tokenData', 'marketCap']),
//   }))
// )
