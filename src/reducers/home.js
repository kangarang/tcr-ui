import { fromJS } from 'immutable'

import {
  SET_WALLET,
  SET_MIN_DEPOSIT,
  SET_TOKENS_ALLOWED,
  SET_CONTRACTS,
  CHANGE_ITEMS,
  CONTRACT_ERROR,
  NEW_ARRAY,
  SET_ETHEREUM_PROVIDER,
  LOGIN_ERROR,
} from '../actions/constants'
import { commonUtils } from '../sagas/utils'

const initialState = fromJS({
  wallet: {
    address: '',
    network: '',
    ethBalance: '',
    token: {
      address: '',
      tokenBalance: '',
      allowances: {
        // registry: {
        //   total: '',
        //   locked: '',
        // },
        // voting: {
        //   total: '',
        //   locked: '',
        // },
      },
    },
  },
  listings: {
    // listing: '',
    // owner: '',
    // challenger: '',
    // latest: {
    //   whitelisted: '',
    //   canBeWhitelisted: '',
    //   sender: '',
    //   blockHash: '',
    //   blockNumber: '',
    //   timestamp: '',
    //   txHash: '',
    //   txIndex: '',
    //   numTokens: '',
    //   event: '',
    //   logIndex: '',
    //   pollID: '',
    // },
  },
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
})

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case CONTRACT_ERROR:
      return state.setIn(['error', 'type'], true)
    case LOGIN_ERROR:
      return state.set('error', action.error)
    case SET_ETHEREUM_PROVIDER:
      return state
        .setIn(['wallet', 'address'], fromJS(action.payload.address))
        .setIn(['wallet', 'ethBalance'], fromJS(action.payload.ethBalance))
        .setIn(['wallet', 'network'], fromJS(action.payload.network))
    case SET_WALLET:
      return state
        .setIn(['wallet', 'address'], fromJS(action.payload.address))
        .setIn(['wallet', 'ethBalance'], fromJS(action.payload.ethBalance))
        .setIn(['wallet', 'network'], fromJS(action.payload.network))
    case SET_CONTRACTS:
      return state
        .setIn(
          ['wallet', 'token', 'tokenName'],
          fromJS(action.payload.token.name)
        )
        .setIn(
          ['wallet', 'token', 'tokenSymbol'],
          fromJS(action.payload.token.symbol)
        )
        .setIn(
          ['wallet', 'token', 'totalSupply'],
          fromJS(action.payload.token.totalSupply)
        )
    case SET_MIN_DEPOSIT:
      return state.setIn(
        ['parameters', 'minDeposit'],
        fromJS(action.minDeposit)
      )
    case SET_TOKENS_ALLOWED:
      return state
        .setIn(
          ['wallet', 'token', 'allowances', 'registry', 'total'],
          fromJS(action.payload.allowance)
        )
        .setIn(
          ['wallet', 'token', 'tokenBalance'],
          fromJS(action.payload.balance)
        )
    case CHANGE_ITEMS:
      return changeListings(state, action.payload)
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
  return state.set('listings', fromJS(payload))
}

function checkShape(thing) {
  switch (thing.latest.event) {
    case '_Application':
      return 'apply'
    case '_Challenge':
      return 'challenge'
    case '_NewListingWhitelisted':
      return 'newlistingwhitelisted'
    default:
      return false
  }
}

// TODO: check blockNumber to make sure updating is ok
function changeListings(state, payload) {
  const newListings = payload.reduce((acc, val) => {
    console.log('acc, val', acc, val)
    const shape = checkShape(val)
    console.log('shape', shape)
    let index
    if (shape === 'apply') {
      index = acc.findIndex(
        ri =>
          commonUtils.getListingHash(ri.get('listing')) ===
          commonUtils.getListingHash(val.listing)
      )
    } else {
      index = acc.findIndex(
        ri => commonUtils.getListingHash(ri.get('listing')) === val.listing
      )
    }

    // const index = acc.findIndex(ri =>
    //   (commonUtils.getListingHash(ri.get('listing')) === commonUtils.getListingHash(val.listing))
    //   || (ri.get('listing') === commonUtils.getListingHash(val.listing))
    //   || (commonUtils.getListingHash(ri.get('listing')) === val.listing)
    // )
    // console.log('index', index)
    if (index === -1) {
      return acc.push(fromJS(val))
    }
    if (val.latest.blockNumber > acc.getIn([index, 'latest', 'blockNumber'])) {
      return acc.setIn([index, 'latest'], fromJS(val.latest))
    }
    return acc
  }, state.get('listings'))

  return state.set('listings', fromJS(newListings))
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
