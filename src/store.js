import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'
import { fromJS, Iterable } from 'immutable'
import throttle from 'lodash/fp/throttle'

import { loadState, saveState } from 'libs/localStorage'
import createReducer from 'modules/reducers'
import rootSaga from 'modules/home/sagas'
import { DECODE_LOGS_START } from 'modules/logs/types'

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

export default function configureStore() {
  let middlewares
  if (process.env.NODE_ENV !== 'production') {
    middlewares = [sagaMiddleware, logger]
  } else {
    middlewares = [sagaMiddleware]
  }

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

  // retrieve persisted redux state from local storage
  // create store for hydrating persistent data into the store
  const persistedState = loadState()

  const store = createStore(
    createReducer(),
    fromJS(persistedState),
    composeEnhancers(...enhancers)
  )

  // persist redux state in local storage
  // no more than once per second
  // By wrapping our callback in a throttle call,
  // we insure that the inner function we pass is not going to be called more often than our specified number of milliseconds
  store.subscribe(
    throttle(1000, () => {
      // saveState({
      //   listings: store.getState().get('listings'),
      // })
      saveState(store.getState())
    })
  )
  // init operations/sagas
  sagaMiddleware.run(rootSaga)

  return store
}
