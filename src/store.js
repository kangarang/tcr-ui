import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'
import { fromJS, isImmutable } from 'immutable'
import throttle from 'lodash/fp/throttle'

import { loadState, saveState, loadSettings } from 'libs/localStorage'
import createReducer from 'modules/reducers'
import rootSaga from 'modules/home/sagas'

const sagaMiddleware = createSagaMiddleware()

const logger = createLogger({
  duration: true,
  timestamp: true,
  // print Immutable objects as JS objects
  actionTransformer: action =>
    isImmutable(action.listings) ? fromJS(action).toJS() : action,
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

  // If settings dictate, retrieve persisted redux state from local storage, hydrate persistent data into the store
  const settings = loadSettings()
  const initialState = settings && settings.persistState ? loadState() : {}

  // Save settings: persist state
  // const serializedSettings = JSON.stringify({ persistState: true })
  // localStorage.setItem('tcruiSettings', serializedSettings)

  const store = createStore(
    createReducer(),
    fromJS(initialState),
    composeEnhancers(...enhancers)
  )

  if (settings && settings.persistState) {
    // persist redux state in local storage
    store.subscribe(
      // no more than once per 5 seconds
      throttle(5000, () => {
        saveState({
          listings: store.getState().get('listings'),
        })
      })
    )
  }
  // init sagas
  sagaMiddleware.run(rootSaga)
  return store
}
