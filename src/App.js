import React from 'react'
import { Provider } from 'react-redux'
import styled from 'styled-components'
import { BrowserRouter as Router } from 'react-router-dom'
import { MuiThemeProvider } from '@material-ui/core/styles'

import { muiTheme } from './global-styles'
import configureStore from './store'
import './App.css'

import Home from 'containers/Home/Loadable'

const store = configureStore()

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
          <Home />
        </Router>
      </MuiThemeProvider>
    </Provider>
  </AppWrapper>
)

export default App
