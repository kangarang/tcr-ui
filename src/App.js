import React from 'react'
import styled from 'styled-components'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'

import Home from 'containers/Home'

import './App.css'
import { theme } from './global-styles'

import configureStore from './store'

import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import { syncHistoryWithStore } from 'react-router-redux'
import createBrowserHistory from 'history/createBrowserHistory'

// import { generateContractsInitialState } from 'drizzle'
// import { DrizzleProvider } from 'drizzle-react'
// import drizzleOptions from './drizzleOptions'
const muiTheme = createMuiTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
  overrides: {
    MuiTabIndicator: {
      root: {
        background: `linear-gradient(to right, ${theme.gradientLeft} 0%, ${
          theme.gradientRight
        } 100%)`,
        border: 0,
        height: 3,
      },
    },
  },
})

console.log('theme:', muiTheme)

const bHistory = createBrowserHistory()
const initialState = {
  // contracts: generateContractsInitialState(drizzleOptions),
}
const store = configureStore(initialState)
const history = syncHistoryWithStore(bHistory, store)

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  margin: 0;
`
const App = () => (
  <div>
    <AppWrapper>
      {/* <DrizzleProvider options={drizzleOptions}> */}
      <Provider store={store}>
        <MuiThemeProvider theme={muiTheme}>
          <Router history={history}>
            <Route path="/" component={Home} />
          </Router>
        </MuiThemeProvider>
      </Provider>
      {/* </DrizzleProvider> */}
    </AppWrapper>
  </div>
)

export default App
