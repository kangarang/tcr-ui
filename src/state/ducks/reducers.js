import { combineReducers } from 'redux-immutable'
import { routerReducer } from 'react-router-redux'

import homeReducer from './home'
import listingsReducer from './listings'
// import transactionsReducer from './transactions'

export default function createReducer() {
  return combineReducers({
    routing: routerReducer,
    home: homeReducer,
    listings: listingsReducer,
    // transactions: transactionsReducer,
  })
}
