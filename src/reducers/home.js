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

// const reactState = {
//   stupid_toggle_components,
//   ethjs,
//   ethereumProvider,
//   HOC/formInput/votingModal/sendTransaction: {
//     amount,
//     vote
//   },
//   contracts: {
//     registry,
//     voting,
//     token,
//     parameterizer
//   }
// }

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
  contracts: {
    registry: {
      address: '0x00',
    },
    token: {
      address: '0x00',
    },
    parameterizer: {
      address: '0x00',
    },
    voting: {
      address: '0x00',
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
  // visiblityFilter: {
  //   listings: ['in_application', 'in_whitelist'],
  //   isPolling: false,
  // },
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
        .setIn(
          ['contracts', 'registry', 'address'],
          fromJS(action.payload.registry.address)
        )
        .setIn(
          ['contracts', 'voting', 'address'],
          fromJS(action.payload.voting.address)
        )
        .setIn(
          ['contracts', 'parameterizer', 'address'],
          fromJS(action.payload.parameterizer.address)
        )
        .setIn(
          ['contracts', 'token', 'address'],
          fromJS(action.payload.token.address)
        )
        // .set('parameters', fromJS(action.payload.parameterizer.parameters))
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
      return replaceListings(state, action.payload)
    default:
      return state
  }
}

function replaceListings(state, payload) {
  return state.set('listings', fromJS(payload))
}

function changeListings(state, payload) {
  const newListings = payload.reduce((acc, val) => {
    const index = acc.findIndex(
      ri => ri.get('listingHash') === val.listingHash
    )

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
