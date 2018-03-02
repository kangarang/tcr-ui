import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'

import { fromJS, Iterable } from 'immutable'

import {
  GET_TOKENS_ALLOWED,
  POLL_LOGS_REQUEST,
  GET_ETH_PROVIDER,
  SET_TOKENS_ALLOWED,
  UPDATE_BALANCES,
  UPDATE_BALANCES_REQUEST,
} from './actions/constants'

import createReducer from './reducers'

import rootSaga from './sagas'
import logSaga from './sagas/logs'
import tokenSaga from './sagas/token'
import udappSaga from './sagas/udapp'
import voteSaga from './sagas/vote'

const sagaMiddleware = createSagaMiddleware()

const stateTransformer = state => {
  if (Iterable.isIterable(state)) return state.toJS()
  return state
}

const logger = createLogger({
  predicate: (getState, action) => (
    action.type !== GET_TOKENS_ALLOWED &&
    action.type !== POLL_LOGS_REQUEST &&
    action.type !== GET_ETH_PROVIDER &&
    action.type !== UPDATE_BALANCES &&
    action.type !== UPDATE_BALANCES_REQUEST &&
    action.type !== SET_TOKENS_ALLOWED),
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

  const store = createStore(
    createReducer(),
    fromJS(initialState),
    composeEnhancers(...enhancers)
  )

  sagaMiddleware.run(rootSaga)
  sagaMiddleware.run(logSaga)
  sagaMiddleware.run(tokenSaga)
  sagaMiddleware.run(voteSaga)
  sagaMiddleware.run(udappSaga)

  // // Make reducers hot reloadable, see http://mxs.is/googmo
  // /* istanbul ignore next */
  // if (module.hot) {
  //   module.hot.accept('./reducers', () => {
  //     store.replaceReducer(createReducer(store.injectedReducers));
  //   });
  // }

  return store
}
