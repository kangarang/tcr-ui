import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import styled from 'styled-components'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import { theme } from './global-styles'
import configureStore from './store'

import Home from 'containers/Home/Loadable'

import './App.css'

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
        width: '100%',
      },
    },
    MuiPaper: {
      root: {},
    },
    MuiTab: {
      wrapper: {
        alignItems: 'flex-start',
      },
    },
    MuiInput: {
      root: {
        display: 'none',
      },
    },
    MuiToolbar: {
      gutters: {},
    },
  },
})

const initialState = {}
const store = configureStore(initialState)

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
