import { List, fromJS } from 'immutable'

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
  ethereum: {
    address: '',
    network: '',
    balance: '',
    token: {
      address: '',
      balance: '',
      allowances: {
        registry: {
          address: '',
          total: {},
          locked: {}
        },
        voting: {
          address: '',
          total: {},
          locked: {}
        }
      }
    }
  },
  listings: {
    byDomain: {},
    allDomains: []
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
    case GET_ETHEREUM:
      return state.set('loading', true).set('error', false)
    // case CHANGE_AMOUNT:
    //   return state.set('amount', action.amount.replace(/@/gi, ''))
    // case CHANGE_DOMAIN:
    //   return state.set('domain', action.domain.replace(/@/gi, ''))
    case CONTRACT_ERROR:
      return state
        .setIn(['error', 'type'], true)
        .setIn(['ethereum', 'address'], fromJS('You need MetaMask!'))
    case SET_ETHJS:
      return state
        .setIn(['ethereum', 'address'], fromJS(action.payload.address))
        .setIn(['ethereum', 'balance'], fromJS(action.payload.balance))
        .setIn(['ethereum', 'network'], fromJS(action.payload.network))
    // .set('currentBlock', fromJS(action.userInfo.blockNumber))
    // case SET_CONTRACTS:
    //   return state
    //     .set('contracts', fromJS(action.contracts))
    //     .set('canonicalMinDeposit', fromJS(action.contracts.parameterizer.minDeposit))
    //     .setIn(
    //     ['userInfo', 'tokenBalance'],
    //     fromJS(action.contracts.token.balance)
    //     )
    // case SET_MIN_DEPOSIT:
    //   return state.set('canonicalMinDeposit', fromJS(action.minDeposit))
    // case SET_TOKENS_ALLOWED:
    //   return state
    //     .set('loading', false)
    //     .set('error', false)
    //     .setIn(['userInfo', 'tokensAllowed'], fromJS(action.allowed))
    case CHANGE_ITEMS:
      return changeItems(state, action.payload)
    case CHANGE_ITEM:
      return changeItem(state, action.payload)
    case NEW_ITEM:
      return state
        .update('listings', list => list.push(fromJS(action.payload)))
    case SET_DECODED_LOGS:
      return setNewItems(state, action.payload)
    // case SET_METHOD_SIGNATURES:
    //   return state.set('methodSignatures', fromJS(action.payload))
    default:
      return state
  }
}

function updateObject(oldObject, newValues) {
  return Object.assign({}, oldObject, fromJS(newValues));
  return oldObject.set(newValues)
}
// return updateObject(todo, {completed : !todo.completed});

function editObject(state, payload) {
  return state
    .setIn(['listings', payload.domain, 'golem'], fromJS(payload.golem))
}

function updateItemInArray(array, domain, updateItemCallback) {
  const updatedItems = array.map(item => {
    const index = array
      .findIndex(ri => ri.get('domain') === domain)
    if (index !== -1) {
      return item
    }
    // Use the provided callback to create an updated item
    const updatedItem = updateItemCallback(item);
    return updatedItem;
  });

  return updatedItems;
}



// Array input
function setNewItems(state, payload) {
  if (!payload || payload.length < 1) {
    return state
  }
  // const newListings = updateItemInArray(state.get('listings'), payload.get('domain'), ri => {
  // })

  // Filters an array of logs to find any duplicate listings
  const uniqueListings = payload.filter(log => {
    const index = state
      .get('listings')
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
    .get('listings')
    .concat(fromJS(uniqueListings))

  return state.set('listings', twoArrays)
}

// TODO: check blockNumber to make sure updating is ok
function changeItems(state, payload) {
  const newItems = payload.reduce((acc, val) => {
    const index = acc.findIndex(ri => ri.get('domain') === val.domain)
    return acc
      .setIn([index, 'golem'], fromJS(val.golem))
  }, state.get('listings'))

  return state.set('listings', newItems)
}

function transformListings(initialValue, value, key, iter) {
  let list = initialValue.get(value.completed.toString()).push(value)
  return initialValue.set(value.completed.toString(), list)
}

// start with a List,
// the shape of the data that you want it to look like at the end
// Then you start iterating over each of the values and push it onto the List if it returns true
function filterStatus(initialValue, value) {
  if (value.completed) {
    initialValue = initialValue.push(value)
  }
  return initialValue
}

// todos.reduce(transformListings, new Immutable.Map({ 'true': Immutable.List(), 'false': Immutable.List() })


function editListing(state, payload) {
    // const newListings = updateItemInArray(state.get('listings'), payload.domain, ri => {
    //   return updateObject(ri, payload.golem)
    // })
    // return state.set('listings', fromJS(newListings))

    const index = state
      .get('listings')
      .findIndex(ri => ri.get('domain') === payload.domain)

    return state.get('listings')
      .setIn([index, 'golem'], fromJS(payload.golem))
  }

export default homeReducer