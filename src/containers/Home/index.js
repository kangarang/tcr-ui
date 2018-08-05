import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
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
import { makeSelectVisibleListings } from 'modules/listings/selectors'
import * as actions from 'modules/home/actions'

import VisibleListings from 'containers/Listings/VisibleListings'
import Listings from 'containers/Listings/Loadable'
import TransactionsProvider from 'containers/Transactions'

import FilterLinks from 'components/FilterLinks'
import Header from 'components/Header'
import Banner from 'components/Banner'
import Registries from 'components/Registries'
import Stats from 'components/Stats'
import toJS from 'components/toJS'

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
    console.log('this.props:', this.props)
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
    const {
      stats,
      network,
      balances,
      tcr,
      notifications,
      filter,
      visibleListings,
    } = this.props

    return (
      <div>
        <Header onHandleToggleRegistries={this.handleToggleRegistries} />
        <Banner tcr={tcr} />
        <Stats balances={balances} stats={stats} tcr={tcr} />

        {/* router navlinks change the value of props.filter */}
        {/* what matters in practice is that there is only 1 single source of truth for any independent piece of data */}
        {/* redux: listings, react-router: anything that can be computed by the URL (visibility filter) */}
        <FilterLinks />
        <VisibleListings visibleListings={visibleListings} />

        {this.state.showRegistries && (
          <Registries network={network} onSelectRegistry={this.handleSelectRegistry} />
        )}

        <Listings />

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
  visibleListings: makeSelectVisibleListings(),
})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)
export default compose(
  withRouter,
  withConnect
)(toJS(Home))
