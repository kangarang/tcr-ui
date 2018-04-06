import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
// import { syncHistoryWithStore } from 'react-router-redux'
// import createBrowserHistory from 'history/createBrowserHistory'

import styled from 'styled-components'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import './App.css'
import { theme } from 'global-styles'

import Home from 'containers/Home/Loadable'
import configureStore from './store'

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

const initialState = {}
const store = configureStore(initialState)
// const browserHistory = createBrowserHistory()
// const history = syncHistoryWithStore(browserHistory, store)

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  margin: 0;
`
const App = () => (
  <AppWrapper>
    <Provider store={store}>
      <MuiThemeProvider theme={muiTheme}>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            {/* <Route path="/:user" component={User}/> */}
            {/* <Route component={NoMatch} /> */}
          </Switch>
        </Router>
      </MuiThemeProvider>
    </Provider>
  </AppWrapper>
)

export default App
