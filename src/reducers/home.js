import { fromJS } from 'immutable'

import {
  CHANGE_DOMAIN,
  CHANGE_AMOUNT,
  SET_CONTRACTS,
  SET_MIN_DEPOSIT,
  SET_TOKENS_ALLOWED,
  SET_ETHJS,
  NEW_ITEM,
  CHANGE_ITEM,
  CHANGE_ITEMS,
  CONTRACT_ERROR,
  LOGS_ERROR,
  GET_ETHEREUM,
  SET_DECODED_LOGS,
  SET_METHOD_SIGNATURES,
} from '../actions/constants'

const initialState = fromJS({
  error: false,
  loading: false,
  domain: '',
  amount: '',
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
})

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ETHEREUM:
      return state.set('loading', true).set('error', false)
    case CHANGE_AMOUNT:
      return state.set('amount', action.amount.replace(/@/gi, ''))
    case CHANGE_DOMAIN:
      return state.set('domain', action.domain.replace(/@/gi, ''))
    case CONTRACT_ERROR:
      return state
        .set('error', true)
        .setIn(['userInfo', 'account'], fromJS('You need MetaMask!'))
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
    case CHANGE_ITEMS:
      return changeItems(state, action.payload)
    case CHANGE_ITEM:
      return changeItem(state, action.payload)
    case NEW_ITEM:
      return state
        .update('registry_items', list => list.push(fromJS(action.payload)))
    case SET_DECODED_LOGS:
      return setNewItems(state, action.payload)
    case SET_METHOD_SIGNATURES:
      return state.set('methodSignatures', fromJS(action.payload))
    default:
      return state
  }
}

// Array input
function setNewItems(state, payload) {
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

// TODO: check blockNumber to make sure updating is ok
function changeItems(state, payload) {
  const newItems = payload.reduce((acc, val) => {
    const index = acc
      .findIndex(ri => ri.get('domain') === val.domain)
    if (val.event === '_Challenge') {
      // Change application -> challenge
      return acc.setIn([index, 'pollID'], val.pollID)
        .setIn([index, 'whitelisted'], false)
    } else if (val.event === '_NewDomainWhitelisted' || val.event === '_ChallengeFailed') {
      // Change thing -> whitelisted
      return acc.setIn([index, 'whitelisted'], true)
      .setIn([index, 'pollID'], false)
    } else {
      return acc
    }
  }, state.get('registry_items'))

  return state.set('registry_items', newItems)
}

function changeItem(state, payload) {
  const index = state
    .get('registry_items')
    .findIndex(ri => ri.get('domain') === payload.domain)
  if (index !== -1) {
    if (payload.event === '_Challenge') {
      // Change registryItem -> challenge
      return state
        .setIn(
          ['registry_items', index, 'pollID'],
          payload.pollID.toString(10)
        )
        // .setIn(
        //   ['registry_items', index, 'whitelisted'], false
        // )
    } else if (payload.event === '_NewDomainWhitelisted' || payload.event === '_ChallengeFailed') {
      // Change thing -> whitelisted
      return state.setIn(['registry_items', index, 'whitelisted'], true)
      .setIn(['registry_items', index, 'pollID'], false)
    }
  }
  return state
}


// function changeItem(state, payload) {
//   const index = state
//     .get('registry_items')
//     .findIndex(ri => ri.get('domain') === payload.args.domain)
//   if (index !== -1) {
//     if (payload.event === '_Challenge') {
//       // Change registryItem -> challenge
//       return state
//         .setIn(
//           ['registry_items', index, 'pollID'],
//           payload.args.pollID.toString(10)
//         )
//         // .setIn(
//         //   ['registry_items', index, 'whitelisted'], false
//         // )
//     } else if (payload.event === '_NewDomainWhitelisted' || payload.event === '_ChallengeFailed') {
//       // Change thing -> whitelisted
//       return state.setIn(['registry_items', index, 'whitelisted'], true)
//       .setIn(['registry_items', index, 'pollID'], false)
//     }
//   }
//   return state
// }

export default homeReducer
