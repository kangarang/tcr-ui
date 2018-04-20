import { combineReducers } from 'redux-immutable'
import { routerReducer } from 'react-router-redux'

import homeReducer from './home'
import transactionsReducer from './transactions'

export default function createReducer() {
  return combineReducers({
    routing: routerReducer,
    home: homeReducer,
    transactions: transactionsReducer,
  })
}
