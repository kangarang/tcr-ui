import { combineReducers } from 'redux-immutable'
import { routerReducer } from 'react-router-redux'
import { reducer as notificationsReducer } from 'react-notification-system-redux'

import homeReducer from './home'
import listingsReducer from './listings'
import transactionsReducer from './transactions'

export default function createReducer() {
  return combineReducers({
    home: homeReducer,
    listings: listingsReducer,
    notifications: notificationsReducer,
    routing: routerReducer,
    transactions: transactionsReducer,
  })
}
