import { combineReducers } from 'redux'
import homeReducer from './home'
import transactionReducer from './transaction'
import listingsReducer from './listings'

export default function createReducer() {
  return combineReducers({
    home: homeReducer,
    transaction: transactionReducer,
    listings: listingsReducer,
  })
}
