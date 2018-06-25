import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'
import { fromJS, Iterable } from 'immutable'

import createReducer from 'modules/reducers'
import rootSaga from 'modules/home/sagas'
import { DECODE_LOGS_START } from './modules/logs/types'

const sagaMiddleware = createSagaMiddleware()

// print Immutable objects as JS objects
const stateTransformer = state => {
  if (Iterable.isIterable(state)) return state.toJS()
  return state
}

const logger = createLogger({
  predicate: (getState, action) => action.type !== DECODE_LOGS_START,
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

  // init operations/sagas
  sagaMiddleware.run(rootSaga)

  return store
}
