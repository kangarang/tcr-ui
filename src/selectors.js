import { createSelector } from 'reselect'

export const selectHome = state => state.get('home')

// Account details selectors
export const selectEthjs = createSelector(selectHome, homeState =>
  homeState.get('ethjs')
)
export const makeSelectUserInfo = () =>
  createSelector(selectHome, homeState => homeState.get('userInfo'))
export const makeSelectAccount = () =>
  createSelector(makeSelectUserInfo(), userInfo => userInfo.get('account'))

// UI selectors
export const selectAmount = createSelector(selectHome, homeState =>
  homeState.get('amount')
)
export const selectDomain = createSelector(selectHome, homeState =>
  homeState.get('domain')
)
export const selectVFilter = createSelector(selectHome, substate =>
  substate.get('vFilter')
)

// Contract selectors
export const makeSelectContracts = () =>
  createSelector(selectHome, homeState => homeState.get('contracts'))
export const makeSelectContract = contract =>
  createSelector(makeSelectContracts(), contracts => contracts.get(contract))
export const selectRegistry = createSelector(
  makeSelectContract('registry'),
  registry => registry
)

// List selectors
export const selectRegistryItems = createSelector(
  selectHome, homeState =>
    homeState.get('registry_items')
)

// Filter selectors
export const makeSelectCandidates = () =>
  createSelector(selectRegistryItems, registry_items =>
    registry_items.filter(ri => (
      ri.get('whitelisted') === false && ri.get('pollID') === false
    ))
  )

export const selectVotingItems = createSelector(
  selectHome, homeState =>
    homeState.get('registry_items').filter(ri => (
      (!ri.get('whitelisted') && ri.get('pollID'))
    ))
)

export const makeSelectWhitelistItems = () =>
  createSelector(selectRegistryItems, registry_items =>
    registry_items.filter(ri => ri.get('whitelisted'))
  )
