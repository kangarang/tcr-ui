export const SET_WALLET = 'SET_WALLET--Home'
export const UPDATE_BALANCES = 'UPDATE_BALANCES--Home'
export const SET_REGISTRY_CONTRACT = 'SET_REGISTRY_CONTRACT--Home'
export const SET_CONTRACTS = 'SET_CONTRACTS--Home'

export function updateBalances(payload) {
  return {
    type: UPDATE_BALANCES,
    payload,
  }
}
export function setRegistryContract(payload) {
  return {
    type: SET_REGISTRY_CONTRACT,
    payload,
  }
}
export function setContracts(payload) {
  return {
    type: SET_CONTRACTS,
    payload,
  }
}
export function setWallet(payload) {
  return {
    type: SET_WALLET,
    payload,
  }
}
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
}

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case SET_WALLET:
      return {
        ...state,
        provider: action.payload.provider,
        account: action.payload.account,
        network: action.payload.network,
      }
    case SET_REGISTRY_CONTRACT:
      return {
        ...state,
        contracts: {
          ...state.contracts,
          registry: action.payload,
        },
      }
    case SET_CONTRACTS:
      return {
        ...state,
        parameters: {
          ...state.parameters,
          ...action.payload.parameters,
        },
        contracts: {
          ...state.contracts,
          ...action.payload.contracts,
        },
        tcr: {
          ...state.tcr,
          ...action.payload.tcr,
        },
      }
    case UPDATE_BALANCES:
      return {
        ...state,
        balances: {
          ...state.balances,
          ...action.payload.balances,
        },
      }
    default:
      return state
  }
}

export default homeReducer
