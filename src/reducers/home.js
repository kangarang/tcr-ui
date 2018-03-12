import { fromJS } from 'immutable'

import {
  LOGIN_ERROR,
  // CONTRACT_ERROR,
  SET_WALLET,
  SET_CONTRACTS,
  UPDATE_BALANCES,
  REQUEST_MODAL_METHOD,
  SET_LISTINGS,
  DELETE_LISTINGS,
  IPFS_ABI_RETRIEVED,
  SET_REGISTRY_CONTRACT,
} from '../actions/constants'

const initialState = fromJS({
  ethjs: {},
  account: '',
  network: '',
  balances: {
    ETH: '0',
    token: '0',
    registryAllowance: '0',
    votingAllowance: '0',
    votingRights: '0',
    lockedTokens: '0',
    claimableReward: '0',
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
  listings: [],
  vFilter: false,
  ipfs: {},
})

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_ERROR:
      return state.set('error', action.error)
    // case CONTRACT_ERROR:
    //   return state.setIn(['error', 'type'], true)
    case SET_WALLET:
      return state
        .set('error', fromJS(false))
        .set('ethjs', fromJS(action.payload.ethjs))
        .set('account', fromJS(action.payload.account))
        .set('network', fromJS(action.payload.network))
    case IPFS_ABI_RETRIEVED:
      return state.setIn(['ipfs', action.payload.id], fromJS(action.payload))
    case SET_REGISTRY_CONTRACT:
      return state
        .setIn(['contracts', 'registry'], fromJS(action.payload))
    case SET_CONTRACTS:
      return state
        .set('parameters', fromJS(action.payload.parameters))
        .set('contracts', fromJS(action.payload.contracts))
    // .set('miningStatus', fromJS({ open: true, message: 'mining Status message' }))
    case UPDATE_BALANCES:
      return state.set('balances', fromJS(action.payload.balances))
    case REQUEST_MODAL_METHOD:
      return state.set('request', fromJS(action.payload))
    // TODO: semantics: set listings
    case SET_LISTINGS:
      return state.set('listings', fromJS(action.payload))
    case DELETE_LISTINGS:
      return deleteObjectInArray(state, action.payload)
    default:
      return state
  }
}

function deleteObjectInArray(array, payload) {
  const index = array.findIndex(ri => ri.get('listingHash') === payload)
  if (index !== -1) {
    return array.delete(index)
  }
  return array
}

export default homeReducer
