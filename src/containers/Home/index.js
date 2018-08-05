import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Route, Switch, withRouter } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import Notifications from 'react-notification-system-redux'

import {
  selectAccount,
  selectNetwork,
  selectBalances,
  selectTCR,
  selectStats,
  selectNotifications,
} from 'modules/home/selectors'
import * as actions from 'modules/home/actions'

import Header from 'components/Header'
import Banner from 'components/Banner'
import Registries from 'components/Registries'
import Stats from 'components/Stats'
import toJS from 'components/toJS'
import Listings from '../Listings/Loadable'
import TransactionsProvider from '../Transactions'

export const StepperContext = React.createContext()

const notificationStyles = {
  NotificationItem: {
    DefaultStyle: {
      margin: '10px 5px 2px 5px',
      width: '400px',
    },
    info: {
      // color: 'black',
      // backgroundColor: 'white',
    },
  },
}

class Home extends Component {
  state = {
    showRegistries: false,
  }
  componentDidMount() {
    this.props.onSetupEthereum()
  }
  handleToggleRegistries = () => {
    this.setState(prevState => ({
      showRegistries: !prevState.showRegistries,
    }))
  }
  handleSelectRegistry = tcr => {
    this.props.onSelectRegistry(tcr)
    this.setState({ showRegistries: false })
  }

  render() {
    const { stats, network, balances, tcr, notifications } = this.props

    return (
      <div>
        <Header onHandleToggleRegistries={this.handleToggleRegistries} />
        <Banner tcr={tcr} />
        <Stats balances={balances} stats={stats} tcr={tcr} />

        {this.state.showRegistries && (
          <Registries network={network} onSelectRegistry={this.handleSelectRegistry} />
        )}

        <Switch>
          <Route exact path="/registries" component={Listings} />
          {/* <Route exact path="/activities" component={Activities} /> */}
        </Switch>

        <TransactionsProvider />
        <Notifications style={notificationStyles} notifications={notifications} />
      </div>
    )
  }
}

// TODO
// 1. in Transactions/index, create the Provider + this.handleTransactions w/ this.props.children
// <TransactionsContext.Provider value={{
//   ...values
// }}>
//   {this.props.children}
// </TransactionsContext.Provider>
// 2. in Listings/index, depending on the listings being rendered, expose Provider + Children. that way we dont have to worry about {methodName === 'commitVote' && (...)}
// <TransactionsProvider>
//   <Apply />
//   <Challenge />
// </TransactionsProvider>
// 3. in Transactions/[transaction], render the Consumer + context options for execution

function mapDispatchToProps(dispatch) {
  return {
    onSetupEthereum: network => dispatch(actions.setupEthereumStart(network)),
    onSelectRegistry: tcr => dispatch(actions.selectRegistryStart(tcr)),
  }
}

const mapStateToProps = createStructuredSelector({
  account: selectAccount,
  network: selectNetwork,
  balances: selectBalances,
  stats: selectStats,
  tcr: selectTCR,

  notifications: selectNotifications,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)
export default compose(withRouter, withConnect)(toJS(Home))
