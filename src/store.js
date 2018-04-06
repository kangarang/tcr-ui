import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'

import { UPDATE_BALANCES_REQUEST, GET_ETHEREUM } from './actions/home'

import createReducer from './reducers'

import rootSaga from './sagas'
import logSaga from './sagas/logs'
import tokenSaga from './sagas/token'
import voteSaga from './sagas/vote'
import contractsSaga from './sagas/contracts'
import transactionSaga from './sagas/transaction'
import eventsSaga from './sagas/events'

const sagaMiddleware = createSagaMiddleware()

const logger = createLogger({
  predicate: (getState, action) =>
    action.type !== GET_ETHEREUM && action.type !== UPDATE_BALANCES_REQUEST,
  collapsed: (getState, action, logEntry) => !action.error,
})

export default function configureStore(initialState = {}) {
  const middlewares = [sagaMiddleware, logger]
  const enhancers = [applyMiddleware(...middlewares)]

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      : compose
  /* eslint-enable */

  const store = createStore(createReducer(), initialState, composeEnhancers(...enhancers))

  sagaMiddleware.run(rootSaga)
  sagaMiddleware.run(logSaga)
  sagaMiddleware.run(tokenSaga)
  sagaMiddleware.run(contractsSaga)
  sagaMiddleware.run(voteSaga)
  sagaMiddleware.run(transactionSaga)
  sagaMiddleware.run(eventsSaga)

  return store
}
