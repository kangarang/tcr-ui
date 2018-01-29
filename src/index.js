import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import { ThemeProvider } from 'styled-components'

import configureStore from './store'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { colors } from './components/Colors';

const initialState = {}
const history = createHistory()
const store = configureStore(initialState, history)

const theme = {
  default: {
    color: colors.offWhite
  }
}

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  </ThemeProvider>,
  document.getElementById('root')
)

registerServiceWorker()
