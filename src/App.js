import React from 'react'
import styled from 'styled-components'
import { MuiThemeProvider } from '@material-ui/core/styles'

import Home from './containers/Home/Loadable'
import { muiTheme } from './global-styles'
import './App.css'

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  margin: 0;
`
const App = ({ match }) => (
  <AppWrapper>
    <MuiThemeProvider theme={muiTheme}>
      <Home filter={match.params.filter || ''} />
    </MuiThemeProvider>
  </AppWrapper>
)

export default App
