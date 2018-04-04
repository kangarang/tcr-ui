import { combineReducers } from 'redux'
import home from './home'
import transaction from './transaction'

export default function createReducer() {
  return combineReducers({
    home,
    transaction,
  })
}
