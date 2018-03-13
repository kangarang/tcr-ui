import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import createHistory from 'history/createBrowserHistory'

import configureStore from './store'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'

const initialState = {}
const history = createHistory()
const store = configureStore(initialState, history)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()
