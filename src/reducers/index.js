import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import homeReducer from './home'
import transactionReducer from './transaction'
import listingsReducer from './listings'

export default function createReducer() {
  return combineReducers({
    routing: routerReducer,
    home: homeReducer,
    transaction: transactionReducer,
    listings: listingsReducer,
  })
}
