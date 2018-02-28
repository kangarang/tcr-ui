import 'babel-polyfill'
import React from 'react'
import styled from 'styled-components'
import { AragonApp } from '@aragon/ui'

import { colors } from '../colors'

import Home from '../containers/Home'

import TopBar from './TopBar'
import Nav from './Nav'

import '../global-styles'

const Wrapper = styled.div`
  background-color: ${colors.offWhite};
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
    <Nav />

    <AppWrapper>
      <AragonApp publicUrl='/aragon-ui'>

        {'APPP'}
        <Home/>

      </AragonApp>
    </AppWrapper>
  </Wrapper>
)

export default App
