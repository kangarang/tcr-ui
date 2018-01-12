import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import { Provider } from 'react-redux'

import App from './App'
import UDapp from './containers/UDapp'

import {colors} from './components/Colors'
import configureStore from './store'
import registerServiceWorker from './registerServiceWorker'

const initialState = {}
const store = configureStore(initialState)

const AppWrapper = styled.div`
  display: flex;
  min-height: 1800px;
  flex-direction: row;
  margin: 0;
  padding: 2em;
  background-color: ${colors.offWhite};
  background-size: auto 120vh;
`

ReactDOM.render(
  <Provider store={store}>
    <AppWrapper>
      <App />
      <UDapp />
    </AppWrapper>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()