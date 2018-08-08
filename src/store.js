import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'
import { fromJS, isImmutable } from 'immutable'
import throttle from 'lodash/fp/throttle'

import { loadState, saveState, loadSettings } from 'libs/localStorage'
import createReducer from 'modules/reducers'
import rootSaga from 'modules/home/sagas'
import balancesSaga from 'modules/home/sagas/balances'
import contractsSaga from 'modules/home/sagas/contracts'
import logsSaga from 'modules/logs/sagas/'
import listingsSaga from 'modules/listings/sagas'
import transactionsSaga from 'modules/transactions/sagas'

const sagaMiddleware = createSagaMiddleware()

// prettier-ignore
const logger = createLogger({
  // duration: true,
  // timestamp: true,
  // print Immutable objects as JS objects
  actionTransformer: action => isImmutable(action.listings) ? fromJS(action).toJS() : action,
  stateTransformer: state => (isImmutable(state) ? state.toJS() : state),
  collapsed: (getState, action, logEntry) => !logEntry.error,
  // predicate: (getState, action) => action.type !== DECODE_LOGS_START,
})

export default function configureStore() {
  let middlewares
  if (process.env.NODE_ENV !== 'production') {
    middlewares = [logger, sagaMiddleware]
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

  const persistedState = loadState()
  const initialState = persistedState ? persistedState : {}

  const store = createStore(
    createReducer(),
    fromJS(initialState),
    composeEnhancers(...enhancers)
  )

  // persist redux state in local storage
  store.subscribe(
    // no more than once per 1 second
    throttle(1000, () => {
      const persistedState = loadState()
      if (persistedState) {
        saveState({
          listings: store.getState().get('listings'),
        })
      }
    })
  )
  // init sagas
  sagaMiddleware.run(rootSaga)
  sagaMiddleware.run(balancesSaga)
  sagaMiddleware.run(contractsSaga)
  sagaMiddleware.run(logsSaga)
  sagaMiddleware.run(listingsSaga)
  sagaMiddleware.run(transactionsSaga)
  return store
}
