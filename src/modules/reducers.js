import { combineReducers } from 'redux-immutable'
import { reducer as notificationsReducer } from 'react-notification-system-redux'
import { routerReducer } from 'react-router-redux'
// import { txPanelRootReducer } from 'eth-tx-panel'

import homeReducer from './home'
import transactionsReducer from './transactions'
import listingsReducer from './listings'

export default function createReducer() {
  return combineReducers({
    notifications: notificationsReducer,
    routing: routerReducer,
    home: homeReducer,
    transactions: transactionsReducer,
    listings: listingsReducer,
    // ...txPanelRootReducer,
  })
}
