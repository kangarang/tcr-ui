import { List, fromJS } from 'immutable'

import {
  SET_ETHJS,
  SET_CONTRACTS,
  SET_MIN_DEPOSIT,
  SET_TOKENS_ALLOWED,
  NEW_ITEM,
  CHANGE_ITEM,
  CHANGE_ITEMS,
  SET_DECODED_LOGS,
  CONTRACT_ERROR,
  LOGS_ERROR,
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
    case CONTRACT_ERROR:
      return state
        .setIn(['error', 'type'], true)
        .setIn(['ethereum', 'address'], fromJS('You need MetaMask!'))
    case SET_ETHJS:
      return state
        .setIn(['ethereum', 'address'], fromJS(action.payload.address))
        .setIn(['ethereum', 'balance'], fromJS(action.payload.balance))
        .setIn(['ethereum', 'network'], fromJS(action.payload.network))
    case SET_MIN_DEPOSIT:
      return state.setIn(['parameters', 'minDeposit'], fromJS(action.minDeposit))
    case SET_TOKENS_ALLOWED:
      return state
        .setIn(['ethereum', 'token', 'allowances', action.payload.allowedContractAddress], fromJS(action.payload.allowance))
    case CHANGE_ITEMS:
      return changeItems(state, action.payload)
    case CHANGE_ITEM:
      return changeItem(state, action.payload)
    case NEW_ITEM:
      return state
        .update('listings', list => list.push(fromJS(action.payload)))
    case SET_DECODED_LOGS:
      return setNewItems(state, action.payload)
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