import { fromJS } from 'immutable'

import {
  SET_WALLET,
  SET_MIN_DEPOSIT,
  SET_TOKENS_ALLOWED,
  SET_CONTRACTS,
  CHANGE_ITEMS,
  CONTRACT_ERROR,
  NEW_ARRAY,
  SET_ETHJS,
} from '../actions/constants'
import { commonUtils } from '../sagas/utils';

const initialState = fromJS({
  wallet: {
    address: '',
    network: '',
    ethBalance: '',
    token: {
      address: '',
      tokenBalance: '',
      allowances: {
        registry: {
          total: '',
          locked: ''
        },
        voting: {
          total: '',
          locked: ''
        }
      }
    }
  },
  listings: {
    byListing: {
      // 'adchain.com': {
      //   listing: '',
      //   owner: '',
      //   challenger: '',
      //   latest: {
      //   whitelisted: '',
      //   canBeWhitelisted: '',
      //     sender: '',
      //     blockHash: '',
      //     blockNumber: '',
      //     timestamp: '',
      //     txHash: '',
      //     txIndex: '',
      //     numTokens: '',
      //     event: '',
      //     logIndex: '',
      //     pollID: ''
      //   }
      // },
    },
    allListings: []
  },
  parameters: {
    minDeposit: '',
    appExpiry: '',
    commitStageLen: '',
    revealStageLen: '',
    voteQuorum: ''
  },
  loading: {
    type: false,
    message: ''
  },
  error: {
    type: false,
    message: ''
  }
})

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case CONTRACT_ERROR:
      return state
        .setIn(['error', 'type'], true)
        .setIn(['wallet', 'address'], fromJS('You need MetaMask!'))
    case SET_ETHJS:
      return state
        .setIn(['wallet', 'address'], fromJS(action.payload.address))
        .setIn(['wallet', 'ethBalance'], fromJS(action.payload.ethBalance))
    case SET_WALLET:
      return state
        .setIn(['wallet', 'address'], fromJS(action.payload.address))
        .setIn(['wallet', 'ethBalance'], fromJS(action.payload.ethBalance))
        .setIn(['wallet', 'network'], fromJS(action.payload.network))
    case SET_CONTRACTS:
      return state.setIn(['wallet', 'token', 'tokenName'], fromJS(action.payload.token.name))
        .setIn(['wallet', 'token', 'tokenSymbol'], fromJS(action.payload.token.symbol))
        .setIn(['wallet', 'token', 'totalSupply'], fromJS(action.payload.token.totalSupply))
    case SET_MIN_DEPOSIT:
      return state.setIn(['parameters', 'minDeposit'], fromJS(action.minDeposit))
    case SET_TOKENS_ALLOWED:
      return state
        .setIn(['wallet', 'token', 'allowances', 'registry', 'total'], fromJS(action.payload.allowance))
        .setIn(['wallet', 'token', 'tokenBalance'], fromJS(action.payload.balance))
    case CHANGE_ITEMS:
      return changeItems(state, action.payload)
    case NEW_ARRAY:
      return newListingsByListing(state, action.payload)
    default:
      return state
  }
}

function newListingsByListing(state, payload) {
  // const newListings = payload.reduce((acc, val) => {
  //   return acc.set(fromJS(val.listing), fromJS(val))
  // }, state.getIn(['listings', 'byListing']))
  // console.log('newListings', newListings.toJS())

  // return state.setIn(['listings', 'byListing'], newListings)
  return state.setIn(['listings', 'byListing'], fromJS(payload))
}

// TODO: check blockNumber to make sure updating is ok
function changeItems(state, payload) {
  const newItems = payload.reduce((acc, val) => {
    const index = acc.findIndex(ri => commonUtils.getListingHash(ri.get('listing')) === commonUtils.getListingHash(val.listing))
    // Unique
    if (index === -1) {
      return acc.push(fromJS(val))
    }
    return acc
      .setIn([index, 'latest'], fromJS(val.latest))

  }, state.getIn(['listings', 'byListing']))

  return state.setIn(['listings', 'byListing'], newItems)
}

// function updateObject(oldObject, newValues) {
//   return Object.assign({}, oldObject, fromJS(newValues));
//   return oldObject.set(newValues)
// }
// // return updateObject(todo, {completed : !todo.completed});

// function updateItemInArray(array, listing, updateItemCallback) {
//   const updatedItems = array.map(item => {
//     const index = array
//       .findIndex(ri => ri.get('listing') === listing)
//     if (index !== -1) {
//       return item
//     }
//     // Use the provided callback to create an updated item
//     const updatedItem = updateItemCallback(item);
//     return updatedItem;
//   });

//   return updatedItems;
// }

export default homeReducer