import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'
import { fromJS, Iterable } from 'immutable'

// import * as reducers from './ducks'
import createReducer from './ducks/reducers'

import types from './ducks/home/types'
import rootSaga from './ducks/home/sagas'

const sagaMiddleware = createSagaMiddleware()

const stateTransformer = state => {
  if (Iterable.isIterable(state)) return state.toJS()
  return state
}

const logger = createLogger({
  predicate: (getState, action) =>
    action.type !== types.SETUP_ETHEREUM_REQUEST && action.type !== types.UPDATE_BALANCES_REQUEST,
  collapsed: (getState, action, logEntry) => !action.error,
  stateTransformer,
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

  const store = createStore(createReducer(), fromJS(initialState), composeEnhancers(...enhancers))

  // init operations/sagas
  sagaMiddleware.run(rootSaga)

  return store
}
