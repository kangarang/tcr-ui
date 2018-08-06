import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Home from './containers/Home/Loadable'
import Registry from './containers/Registry/Loadable'

class RootClass extends Component {
  render() {
    const { store } = this.props

    const routes = (
      <Switch>
        {/* :[variables] are accessible via `props.match.params` */}
        <Route exact path="/:filter?" component={Home} />
        <Route path="/:registryAddress/:filter?" component={Registry} />
        {/* <Route path="/registry/:registryAddress" component={Registry} /> */}
        {/* <Route path="/activities" component={Activities} /> */}
      </Switch>
    )

    return (
      <Provider store={store}>
        <Router>
          <React.Fragment>{routes}</React.Fragment>
        </Router>
      </Provider>
    )
  }
}

export default RootClass
