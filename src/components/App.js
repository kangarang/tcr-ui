import 'babel-polyfill'
import React from 'react'
import styled from 'styled-components'
import { AragonApp } from '@aragon/ui'

import Home from 'containers/Home'

import { colors } from '../colors'
import '../global-styles'

import TopGradient from './TopGradient'

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
        <Home />
      </AragonApp>
    </AppWrapper>
  </Wrapper>
)

export default App
