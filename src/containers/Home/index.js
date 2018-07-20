import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Route, Switch, withRouter } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import Notifications from 'react-notification-system-redux'
// import EthTxPanel from 'eth-tx-panel'

import {
  selectError,
  selectAccount,
  selectNetwork,
  selectBalances,
  selectTCR,
  selectStats,
  selectNotifications,
  selectAllContracts,
} from 'modules/home/selectors'
import * as actions from 'modules/home/actions'
import * as liActions from 'modules/listings/actions'

import Header from 'components/Header'
import Banner from 'components/Banner'
import Registries from 'components/Registries'
import Stats from 'components/Stats'
import toJS from 'components/toJS'
import Listings from '../Listings/Loadable'

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
    const {
      error,
      account,
      network,
      balances,
      stats,
      tcr,
      notifications,
      contracts,
    } = this.props

    const registries = [
      {
        name: 'The adChain Registry',
        address: '0x1',
        network_id: '1',
      },
      {
        name: 'Test Chain Registry',
        address: '0x2',
        network_id: '1',
      },
      {
        name: 'The Sunset Registry',
        address: '0x3',
        network_id: '1',
      },
      {
        name: 'ethaireum',
        address: '0x4',
        network_id: '1',
      },
      {
        name: 'urbancryptionary',
        address: '0x5',
        network_id: '1',
      },
    ]

    return (
      <div>
        <Header
          error={error}
          openSidePanel={this.openSidePanel}
          account={account}
          network={network}
          tcr={tcr}
          contracts={contracts}
        />

        <Banner />

        <Stats
          error={error}
          account={account}
          network={network}
          balances={balances}
          stats={stats}
          tcr={tcr}
          openSidePanel={e => this.props.onOpenSidePanel(null, 'transfer')}
        />

        <Registries
          error={error}
          account={account}
          network={network}
          balances={balances}
          stats={stats}
          tcr={tcr}
          registries={registries}
        />

        <Switch>
          <Route exact path="/" component={Listings} />
          {/* <Route exact path="/activities" component={Activities} /> */}
        </Switch>

        {/* <EthTxPanel /> */}
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
  contracts: selectAllContracts,

  notifications: selectNotifications,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)
export default compose(withRouter, withConnect)(toJS(Home))
