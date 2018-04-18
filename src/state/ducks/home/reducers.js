import types from './types'

const initialState = {
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
}

function homeReducer(state = initialState, action) {
  switch (action.type) {
    // case types.SET_ABIS:
    //   return {
    //     ...state,
    //     abis: {
    //       ...state.abis,
    //       ...action.abis,
    //     },
    //   }
    // case types.SET_WALLET:
    //   return {
    //     ...state,
    //     provider: action.payload.provider,
    //     account: action.payload.account,
    //     network: action.payload.network,
    //   }
    // case types.SET_REGISTRY_CONTRACT:
    //   return {
    //     ...state,
    //     contracts: {
    //       ...state.contracts,
    //       registry: action.payload,
    //     },
    //   }
    // case types.SET_CONTRACTS:
    //   return {
    //     ...state,
    //     parameters: {
    //       ...state.parameters,
    //       ...action.payload.parameters,
    //     },
    //     contracts: {
    //       ...state.contracts,
    //       ...action.payload.contracts,
    //     },
    //     tcr: {
    //       ...state.tcr,
    //       ...action.payload.tcr,
    //     },
    //   }
    // case types.UPDATE_BALANCES:
    //   return {
    //     ...state,
    //     balances: {
    //       ...state.balances,
    //       ...action.payload.balances,
    //     },
    //   }
    default:
      return state
  }
}

export default homeReducer
