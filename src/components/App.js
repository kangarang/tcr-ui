import 'babel-polyfill'
import React from 'react'
import styled from 'styled-components'
import { AragonApp } from '@aragon/ui'

import Home from 'containers/Home'

import { colors } from '../colors'
import '../global-styles'

import TopGradient from './TopGradient'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'

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

const Wrapper = styled.div`
  background-color: ${colors.offWhite};
`
const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${colors.offWhite};
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
`
const App = () => (
  <Wrapper>
    <TopGradient />
    <AppWrapper>
      <AragonApp publicUrl="/aragon-ui/">
        <MuiThemeProvider theme={theme}>
          <Home />
        </MuiThemeProvider>
      </AragonApp>
    </AppWrapper>
  </Wrapper>
)

export default App
