import 'babel-polyfill'
import React from 'react'
import styled from 'styled-components'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'

import Home from 'containers/Home'

import './App.css'
import { theme } from './global-styles'

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
      <MuiThemeProvider theme={muiTheme}>
        <Home />
      </MuiThemeProvider>
    </AppWrapper>
  </div>
)

export default App
