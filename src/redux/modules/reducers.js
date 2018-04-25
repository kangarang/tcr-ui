import { combineReducers } from 'redux-immutable'
import { routerReducer } from 'react-router-redux'
import { reducer as notifications } from 'react-notification-system-redux'

import homeReducer from './home'
import transactionsReducer from './transactions'
// import activities from './activities'

export default function createReducer() {
  return combineReducers({
    routing: routerReducer,
    home: homeReducer,
    transactions: transactionsReducer,
    notifications,
    // activities,
  })
}
