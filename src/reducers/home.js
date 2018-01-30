import { fromJS } from 'immutable'

import {
  SET_WALLET,
  SET_MIN_DEPOSIT,
  SET_TOKENS_ALLOWED,
  SET_CONTRACTS,
  DELETE_LISTINGS,
  CHANGE_ITEMS,
  CONTRACT_ERROR,
  NEW_ARRAY,
  SET_ETHEREUM_PROVIDER,
  LOGIN_ERROR,
  LOGOUT_SUCCESS,
  LOGIN_SUCCESS,
  SELECT_CUSTOM_METHODS,
} from '../actions/constants'

const initialState = fromJS({
  wallet: {
    address: '',
    network: '4',
    ethBalance: '',
    token: {
      decimals: '',
      address: '',
      tokenBalance: '',
      allowances: {},
    },
  },
  services: {
    parameterizer: {
      votingRights: '0',
    },
    token: {
      decimalPower: '0',
    },
  },
  contracts: {
    registry: {
      address: '',
    },
    token: {
      address: '',
    },
    parameterizer: {
      address: '',
    },
    voting: {
      address: '',
    },
  },
  listings: {},
  parameters: {
    minDeposit: '',
    appExpiry: '',
    commitStageLen: '',
    revealStageLen: '',
    voteQuorum: '',
  },
  loading: {
    type: false,
    message: '',
  },
  error: {
    type: false,
    message: '',
  },
  ecRecovered: false,
  customMethods: [],
  ethjs: {},
})

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case CONTRACT_ERROR:
      return state.setIn(['error', 'type'], true)
    case SELECT_CUSTOM_METHODS:
      return state.set('customMethods', fromJS(action.payload.customMethods))
    case LOGIN_SUCCESS:
      return state.set('ecRecovered', fromJS(true))
    case LOGOUT_SUCCESS:
      return state
        .setIn(['wallet', 'address'], fromJS(''))
        .setIn(['wallet', 'ethBalance'], fromJS(''))
        .setIn(['wallet', 'network'], fromJS(''))
        .setIn(['wallet', 'token', 'tokenName'], fromJS(''))
        .setIn(['wallet', 'token', 'tokenSymbol'], fromJS(''))
        .setIn(['wallet', 'token', 'tokenBalance'], fromJS(''))
        .setIn(['wallet', 'token', 'allowances'], fromJS({}))
    case LOGIN_ERROR:
      return state.set('error', action.error)
    case SET_ETHEREUM_PROVIDER:
      return state
        .setIn(['wallet', 'address'], fromJS(action.payload.address))
        .setIn(['wallet', 'ethBalance'], fromJS(action.payload.ethBalance))
        .setIn(['wallet', 'network'], fromJS(action.payload.network))
        .set('ethjs', fromJS(action.payload.ethjs))
    case SET_WALLET:
      return state
        .setIn(['wallet', 'address'], fromJS(action.payload.address))
        .setIn(['wallet', 'ethBalance'], fromJS(action.payload.ethBalance))
        .setIn(['wallet', 'network'], fromJS(action.payload.network))
        .set('ethjs', fromJS(action.payload.ethjs))
    case SET_CONTRACTS:
      return state
        .setIn(['wallet', 'token', 'tokenName'], fromJS(action.payload.token.name))
        .setIn(['wallet', 'token', 'decimals'], fromJS(action.payload.token.decimals))
        .setIn(['wallet', 'token', 'tokenSymbol'], fromJS(action.payload.token.symbol))
        .setIn(
          ['wallet', 'token', 'totalSupply'],
          fromJS(action.payload.token.totalSupply)
        )
        .setIn(
          ['contracts', 'registry', 'address'],
          fromJS(action.payload.registry.address)
        )
        .setIn(['contracts', 'voting', 'address'], fromJS(action.payload.voting.address))
        .setIn(
          ['contracts', 'parameterizer', 'address'],
          fromJS(action.payload.parameterizer.address)
        )
        .set('parameters', fromJS(action.payload.parameterizer.parameters))
        .setIn(['services', 'token'], fromJS(action.payload.token))
        .setIn(['services', 'parameterizer'], fromJS(action.payload.parameterizer))
        .setIn(['contracts', 'token', 'address'], fromJS(action.payload.token.address))
    case SET_MIN_DEPOSIT:
      return state.setIn(['parameters', 'minDeposit'], fromJS(action.minDeposit))
    case SET_TOKENS_ALLOWED:
      return state
        .setIn(
          ['wallet', 'token', 'allowances', action.payload.spender, 'votingRights'],
          fromJS(action.payload.votingRights)
        )
        .setIn(
          ['wallet', 'token', 'allowances', action.payload.spender, 'total'],
          fromJS(action.payload.allowance)
        )
        .setIn(['wallet', 'token', 'tokenBalance'], fromJS(action.payload.balance))
    case CHANGE_ITEMS:
      return changeListings(state, action.payload)
    case DELETE_LISTINGS:
      return deleteObjectInArray(state, action.payload)
    case NEW_ARRAY:
      return replaceListings(state, action.payload)
    default:
      return state
  }
}

function replaceListings(state, payload) {
  const filteredPayload = payload.reduce((acc, val) => {
    return acc.filter(a => a.listingHash !== val.listingHash)
  }, [])
  return state.set('listings', fromJS(filteredPayload))
}

function changeListings(state, payload) {
  const newListings = payload.reduce((acc, val) => {
    const index = acc.findIndex(ri => ri.get('listingHash') === val.listingHash)
    // New listing
    if (index === -1) {
      return acc.push(fromJS(val))
    }
    // Check to see if the event is the more recent
    if (val.latest.blockNumber > acc.getIn([index, 'latest', 'blockNumber'])) {
      return acc.setIn([index, 'latest'], fromJS(val.latest))
    }
    // Not unique, not more recent, return List
    return acc
  }, state.get('listings'))

  // Replace entire List
  return state.set('listings', newListings)
}

function deleteObjectInArray(array, payload) {
  return payload.map(pl => {
    const index = array.findIndex(
      ri =>
        ri.get('listingHash') === pl.listingHash || ri.get('listingHash') === pl.listing
    )
    if (index !== -1) {
      return array.delete(index)
    }
    return array
  })
}

export default homeReducer
