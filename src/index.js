import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import { Provider } from 'react-redux'

import App from './App'

import adwaitaDay from './assets/images/adwaita-day.jpg'
// import adwaitaNight from './assets/images/adwaita-night.jpg'
// import adwaitaLock from './assets/images/adwaita-lock.jpg'
// import adwaitaMorning from './assets/images/adwaita-morning.jpg'

import configureStore from './store'
import registerServiceWorker from './registerServiceWorker'

const initialState = {}
const store = configureStore(initialState)

const AppWrapper = styled.div`
  display: flex;
  min-height: 1800px;
  flex-direction: column;
  margin: 0;
  padding: 2em;
  /* background-image: url(${adwaitaDay});
  background-color: rgba(0, 0, 0, 0.2);
  background-size: auto 120vh;
  background-repeat: repeat-y; */
`

ReactDOM.render(
  <Provider store={store}>
    <AppWrapper>
      <App />
    </AppWrapper>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()