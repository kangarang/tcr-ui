import 'babel-polyfill'
import React from 'react'
import styled from 'styled-components'
import { AragonApp } from '@aragon/ui'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'

import Home from 'containers/Home'

import '../global-styles'
import { colors } from '../global-styles'

const theme = createMuiTheme({
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
        background: `linear-gradient(to right, ${
          colors.buttonGradient.left
        } 0%, ${colors.buttonGradient.right} 100%)`,
        border: 0,
        height: 3,
      },
    },
  },
})

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
      <AragonApp publicUrl="/aragon-ui/">
        <MuiThemeProvider theme={theme}>
          <Home />
        </MuiThemeProvider>
      </AragonApp>
    </AppWrapper>
  </div>
)

export default App
