import React from 'react'
import { Switch, Route } from 'react-router-dom'
import styled from 'styled-components'
// import NotificationSystem from 'react-notification-system'

import Home from './containers/Home'
import Apply from './containers/Apply'
import Challenge from './containers/Challenge'
import Vote from './containers/Vote'
import Activities from './containers/Activities'
import Search from './containers/Search'

import { colors } from './components/Colors'
import './global-styles'

const AppWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0;
  padding: .2em;
  background-color: ${colors.offWhite};
  min-height: 100vh;
`
const App = () => (
  <AppWrapper>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/apply' component={Apply} />
      <Route path='/challenge' component={Challenge} />
      <Route path='/vote' component={Vote} />
      <Route path='/activities' component={Activities} />
      <Route path='/search' component={Search} />
    </Switch>
  </AppWrapper>
)

export default App