import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import App from './App'

const Root = ({ store }) => (
  <Provider store={store}>
    <Router>
      {/* filter: gets passed down to the App component via react-router, as a special `match` prop */}
      <Route exact path="/:filter?" component={App} />
    </Router>
  </Provider>
)

export default Root
