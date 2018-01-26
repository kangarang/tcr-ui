import React from 'react'
import { Switch, Route } from 'react-router-dom'
import styled from 'styled-components'

import Home from './containers/Home'
import Challenge from './containers/Challenge'
import Vote from './containers/Vote'
import Activities from './containers/Activities'
import Search from './containers/Search'
import Nav from './containers/Nav'

import { colors } from './components/Colors'
import './global-styles'

const Wrapper = styled.div`
  background-color: ${colors.offWhite};
`
export const TopBar = styled.div`
  position: absolute;
  background: linear-gradient(to right, ${colors.prism}, ${colors.darkBlue});
  height: 6px;
  width: 100%;
  z-index: 9;
`
const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em 3em;
  background-color: ${colors.offWhite};
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
`
const App = () => (
  <Wrapper>
    <TopBar />
    <AppWrapper>
      <Nav />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/challenge" component={Challenge} />
        <Route exact path="/vote" component={Vote} />
        <Route exact path="/activities" component={Activities} />
        <Route exact path="/search" component={Search} />
      </Switch>
    </AppWrapper>
  </Wrapper>
)

export default App
