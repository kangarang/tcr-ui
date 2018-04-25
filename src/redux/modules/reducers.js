import { combineReducers } from 'redux-immutable'
import { reducer as notificationsReducer } from 'react-notification-system-redux'
import { routerReducer } from 'react-router-redux'

import homeReducer from './home'
import transactionsReducer from './transactions'
import listingsReducer from './listings'
// import activities from './activities'

export default function createReducer() {
  return combineReducers({
    notifications: notificationsReducer,
    routing: routerReducer,
    home: homeReducer,
    transactions: transactionsReducer,
    listings: listingsReducer,
    // activities,
  })
}
