import { combineReducers } from 'redux-immutable'
import home from './home'
import transaction from './transaction'
import stats from './stats'

export default function createReducer() {
  return combineReducers({
    home,
    transaction,
    stats,
  })
}
