import { createSelector } from 'reselect'

export const selectHome = state => state.get('home')

// Account details selectors
export const selectEthjs = createSelector(selectHome, homeState =>
  homeState.get('ethjs')
)
export const selectAccount = createSelector(
  makeSelectParameters(), parameters =>
    parameters.get('account')
)

export const makeSelectParameters = () => createSelector(
  selectHome, homeState => homeState.get('parameters')
)

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
export const selectListings = createSelector(
  selectHome, homeState =>
    homeState.get('listings')
)

// Filter selectors
export const makeSelectCandidates = () =>
  createSelector(selectListings, listings =>
    listings.filter(ri => (
      ri.get('whitelisted') === false && ri.get('pollID') === false
    ))
  )

export const selectFaceoffs = createSelector(
  selectHome, homeState =>
    homeState.get('listings').filter(ri => (
      (!ri.get('whitelisted') && ri.get('pollID'))
    ))
)

export const makeSelectWhitelistItems = () =>
  createSelector(selectListings, listings =>
    listings.filter(ri => ri.get('whitelisted'))
  )
