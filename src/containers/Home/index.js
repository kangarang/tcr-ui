import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Route, Switch, withRouter } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import Notifications from 'react-notification-system-redux'

import {
  selectError,
  selectAccount,
  selectNetwork,
  selectBalances,
  selectTCR,
  selectStats,
  selectNotifications,
} from 'modules/home/selectors'
import * as actions from 'modules/home/actions'
import * as liActions from 'modules/listings/actions'

import Header from 'components/Header'
import Stats from 'components/Stats'
import Listings from '../Listings/Loadable'
import Activities from '../Activities/Loadable'

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
  componentDidMount() {
    this.props.onSetupEthereum()
  }
  openSidePanel = () => {
    this.props.onOpenSidePanel(null, 'apply')
  }
  render() {
    const { error, account, network, balances, stats, tcr, notifications } = this.props

    return (
      <div>
        <Header
          error={error}
          openSidePanel={this.openSidePanel}
          account={account}
          network={network}
          tcr={tcr}
        />

        <Stats
          error={error}
          account={account}
          network={network}
          balances={balances}
          stats={stats}
          tcr={tcr}
          openSidePanel={e => this.props.onOpenSidePanel(null, 'transfer')}
        />

        <Switch>
          <Route exact path="/" component={Listings} />
          <Route exact path="/activities" component={Activities} />
        </Switch>

        <Notifications style={notificationStyles} notifications={notifications} />
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSetupEthereum: network => dispatch(actions.setupEthereumStart(network)),
    onOpenSidePanel: (selectedOne, methodName) =>
      dispatch(liActions.openSidePanel(selectedOne, methodName)),
  }
}

const mapStateToProps = createStructuredSelector({
  error: selectError,
  account: selectAccount,
  network: selectNetwork,
  balances: selectBalances,
  tcr: selectTCR,
  stats: selectStats,

  notifications: selectNotifications,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)
export default compose(withRouter, withConnect)(Home)
