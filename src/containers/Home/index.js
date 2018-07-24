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

import { registries } from 'config'

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
  applyListing = () => {
    this.props.onOpenSidePanel(null, 'apply')
  }
  transferTokens = () => {
    this.props.onOpenSidePanel(null, 'transfer')
  }
  handleSelectRegistry = tcr => {
    this.props.onSelectRegistry(tcr)
  }
  handleToggleRegistries = () => {
    this.setState(prevState => ({
      showRegistries: !prevState.showRegistries,
    }))
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

    return (
      <div>
        <Header
          error={error}
          openSidePanel={this.openSidePanel}
          account={account}
          network={network}
          tcr={tcr}
          balances={balances}
          contracts={contracts}
          onHandleToggleRegistries={this.handleToggleRegistries}
          applyListing={this.applyListing}
          transferTokens={this.transferTokens}
        />

        <Banner tcr={tcr} />

        <Stats
          error={error}
          account={account}
          network={network}
          balances={balances}
          stats={stats}
          tcr={tcr}
        />

        {this.state.showRegistries && (
          <Registries
            error={error}
            account={account}
            network={network}
            balances={balances}
            stats={stats}
            tcr={tcr}
            registries={registries[network]}
            onSelectRegistry={this.handleSelectRegistry}
          />
        )}

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
    onSelectRegistry: tcr => dispatch(actions.selectRegistryStart(tcr)),
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
