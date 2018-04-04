import {
  LOGIN_ERROR,
  SET_WALLET,
  SET_REGISTRY_CONTRACT,
  SET_CONTRACTS,
  UPDATE_BALANCES,
  SET_LISTINGS,
  UPDATE_LISTING,
} from '../actions/constants'

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
  contracts: {
    registry: {},
    token: { name: '' },
    voting: {},
    parameterizer: {},
    tokenName: '',
    registryName: '',
    tokenSymbol: '',
    tokenDecimals: '18',
  },
  parameters: { minDeposit: '0', applyStageLen: '0' },
  listings: {},
  latestTxn: {},
}

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_ERROR:
      return {
        ...state,
        error: action.error,
      }
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
      }
    case UPDATE_BALANCES:
      return {
        ...state,
        balances: {
          ...state.balances,
          ...action.payload.balances,
        },
      }
    case UPDATE_LISTING:
      return {
        ...state,
        listings: {
          ...state.listings,
          [action.payload.listingHash]: action.payload,
        },
      }
    case SET_LISTINGS:
      return {
        ...state,
        listings: {
          ...state.listings,
          ...action.payload,
        },
      }
    default:
      return state
  }
}

export default homeReducer
