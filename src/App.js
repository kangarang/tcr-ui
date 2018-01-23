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
import Nav from './containers/Nav'

import { colors } from './components/Colors'
import './global-styles'

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
  background-color: ${colors.offWhite};
  min-height: 100vh;
`
const App = () => (
  <AppWrapper>
    <Nav />
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/apply' component={Apply} />
      <Route exact path='/challenge' component={Challenge} />
      <Route exact path='/vote' component={Vote} />
      <Route exact path='/activities' component={Activities} />
      <Route exact path='/search' component={Search} />
    </Switch>
  </AppWrapper>
)

export default App