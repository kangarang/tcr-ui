import { fromJS } from 'immutable'

import {
  CHANGE_DOMAIN,
  SET_CONTRACTS,
  SET_MIN_DEPOSIT,
  SET_TOKENS_ALLOWED,
  SET_ETHJS,
  EVENT_FROM_REGISTRY,
  EVENT_VOTING_ITEM,
  EVENT_WHITELIST,
  CONTRACT_ERROR,
  LOGS_ERROR,
  GET_ETHEREUM,
  SET_DECODED_LOGS,
  SET_METHOD_SIGNATURES,
} from './constants'

const initialState = fromJS({
  error: false,
  loading: false,
  domain: '',
  contracts: {},
  canonicalMinDeposit: '',
  ethjs: {},
  userInfo: {
    account: '',
    ethBalance: '',
    network: '',
    tokenBalance: '0',
    tokensAllowed: '0',
  },
  currentBlock: '',
  registry_items: [],
  voting_items: [],
  whitelist_items: [],
})

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ETHEREUM:
      return state.set('loading', true).set('error', false)
    case CHANGE_DOMAIN:
      return state.set('domain', action.domain.replace(/@/gi, ''))
    case CONTRACT_ERROR:
      return state.set('error', true)
    case LOGS_ERROR:
      return state.set('error', true)
    case SET_ETHJS:
      return state
        .set('ethjs', fromJS(action.ethjs))
        .set('currentBlock', fromJS(action.userInfo.blockNumber))
        .setIn(['userInfo', 'account'], fromJS(action.userInfo.account))
        .setIn(['userInfo', 'ethBalance'], fromJS(action.userInfo.ethBalance))
        .setIn(['userInfo', 'network'], fromJS(action.userInfo.network))
    case SET_CONTRACTS:
      return state
        .set('contracts', fromJS(action.contracts))
        .setIn(
          ['userInfo', 'tokenBalance'],
          fromJS(action.contracts.token.balance)
        )
    case SET_MIN_DEPOSIT:
      return state.set('canonicalMinDeposit', fromJS(action.minDeposit))
    case SET_TOKENS_ALLOWED:
      return state
        .set('loading', false)
        .set('error', false)
        .setIn(['userInfo', 'tokensAllowed'], fromJS(action.allowed))
    case EVENT_VOTING_ITEM:
      return handleEvent(state, action.payload)
    case EVENT_FROM_REGISTRY:
      return handleEvent(state, action.payload)
    case EVENT_WHITELIST:
      return handleWhitelist(state, action.payload)
    case SET_DECODED_LOGS:
      return handleDecodedLogs(state, action.payload)
    case SET_METHOD_SIGNATURES:
      return state.set('methodSignatures', fromJS(action.payload))
    default:
      return state
  }
}

// Array input
function handleDecodedLogs(state, payload) {
  if (!payload || payload.length < 1) {
    return state
  }

  // Filters an array of logs to find one that matches domain
  const uniqueRegistryItems = payload.filter(log => {
    const index = state
      .get('registry_items')
      .findIndex(ri => ri.get('domain') === log.domain)
    if (index === -1) {
      // Unique registry item
      return true
    }
    // Duplicate registry item
    return false
  })

  // Concatenates two arrays
  const twoArrays = state
    .get('registry_items')
    .concat(fromJS(uniqueRegistryItems))
  return state.set('registry_items', twoArrays)
}

// Object input
function handleEvent(state, payload) {
  const index = state
    .get('registry_items')
    .findIndex(ri => ri.get('domain') === payload.domain)
  if (index !== -1 && payload.challengeID) {
    // Delete existing registry item
    // Create new voting item
    return state
      .deleteIn(['registry_items', index])
      .update('voting_items', list => list.push(fromJS(payload)))
  } else if (index !== -1 && !payload.challengeID) {
    // Duplicate registry item
    return state
  }
  // New registry item
  return state.update('registry_items', list => list.push(fromJS(payload)))
}

// Object input
function handleWhitelist(state, payload) {
  const index = state
    .get('registry_items')
    .findIndex(ri => ri.get('domain') === payload.domain)
  if (index !== -1) {
    // Change application -> listing
    return state.setIn(['registry_items', index, 'whitelisted'], true)
  }
  return state
}

export default homeReducer
