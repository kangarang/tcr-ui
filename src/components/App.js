import 'babel-polyfill'
import React from 'react'
import styled from 'styled-components'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import { AragonApp } from '@aragon/ui'

import Home from 'containers/Home'
import '../global-styles'

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
})

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
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
