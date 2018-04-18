import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import homeReducer from './home'
// import transactionsReducer from './transactions'
// import listingsReducer from './listings'

export default function createReducer() {
  return combineReducers({
    routing: routerReducer,
    home: homeReducer,
    // transactions: transactionsReducer,
    // listings: listingsReducer,
  })
}
