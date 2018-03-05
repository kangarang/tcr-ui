import { fromJS } from 'immutable'

import {
  LOGIN_ERROR,
  // CONTRACT_ERROR,
  SET_WALLET,
  SET_CONTRACTS,
  UPDATE_BALANCES,
  REQUEST_MODAL_METHOD,
  NEW_ARRAY,
  DELETE_LISTINGS,
  SEND_TRANSACTION,
  TXN_MINED,
} from '../actions/constants'

const initialState = fromJS({
  ethjs: {},
  account: '',
  networkID: '',
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
  },
  parameters: { minDeposit: '', applyStageLen: '' },
  listings: [],
  txnStatus: false,
  latestTxn: false,
  miningStatus: false,
  vFilter: false,
})

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_ERROR:
      return state.set('error', action.error)
    // case CONTRACT_ERROR:
    //   return state.setIn(['error', 'type'], true)
    case TXN_MINED:
      return state
        .set('miningStatus', fromJS(false))
        .set('latestTxn', fromJS(action.payload))
    case SEND_TRANSACTION:
      return state.set('miningStatus', fromJS(true))
    case SET_WALLET:
      return state
        .set('error', fromJS(false))
        .set('ethjs', fromJS(action.payload.ethjs))
        .set('account', fromJS(action.payload.account))
        .set('networkID', fromJS(action.payload.networkID))
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
    case NEW_ARRAY:
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
