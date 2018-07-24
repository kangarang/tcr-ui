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
import Transactions from '../Transactions'

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

  render() {
    const { stats, network, balances, tcr, notifications } = this.props

    return (
      <div>
        <Header onHandleToggleRegistries={this.handleToggleRegistries} />
        <Banner tcr={tcr} />
        <Stats balances={balances} stats={stats} tcr={tcr} />

        {this.state.showRegistries && (
          <Registries network={network} onSelectRegistry={this.props.onSelectRegistry} />
        )}

        <Switch>
          <Route exact path="/" component={Listings} />
          {/* <Route exact path="/activities" component={Activities} /> */}
        </Switch>

        <Transactions />
        <Notifications style={notificationStyles} notifications={notifications} />
      </div>
    )
  }
}

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
  tcr: selectTCR,
  stats: selectStats,

  notifications: selectNotifications,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)
export default compose(withRouter, withConnect)(toJS(Home))
