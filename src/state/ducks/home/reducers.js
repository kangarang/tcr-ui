import { fromJS } from 'immutable'

import types from './types'

const initialState = fromJS({
  provider: {},
  account: '',
  network: '',
  balances: {
    ETH: '0',
    token: '0',
    registryAllowance: '0',
    votingAllowance: '0',
    votingRights: '0',
    lockedTokens: '0',
    totalRegistryStake: '0',
  },
  tcr: {
    tokenName: '',
    registryName: '',
    tokenSymbol: '',
    tokenDecimals: '18',
  },
  contracts: {
    registry: {},
    token: { name: '' },
    voting: {},
    parameterizer: {},
  },
  parameters: { minDeposit: '0', applyStageLen: '0' },
  latestTxn: {},
  abis: {},
})

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_ABIS:
      return state.set('abis', fromJS(action.abis))
    case types.SET_WALLET:
      return state
        .set('account', fromJS(action.payload.account))
        .set('network', fromJS(action.payload.network))
    case types.SET_REGISTRY_CONTRACT:
      return state.setIn(['contracts', 'registry'], fromJS(action.payload))
    case types.SET_CONTRACTS:
      return state
        .set('parameters', fromJS(action.payload.parameters))
        .set('contracts', fromJS(action.payload.contracts))
        .set('tcr', fromJS(action.payload.tcr))
    case types.UPDATE_BALANCES:
      return state.set('balances', fromJS(action.payload.balances))
    default:
      return state
  }
}

export default homeReducer
