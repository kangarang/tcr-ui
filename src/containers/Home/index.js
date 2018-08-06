import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'

import { selectBalances, selectTCR, selectStats } from 'modules/home/selectors'
import * as actions from 'modules/home/actions'

import Banner from 'components/Banner'
import Stats from 'components/Stats'
import toJS from 'components/toJS'
import Wrapper from '../Wrapper'

class Home extends Component {
  state = {
    showRegistries: false,
  }
  componentDidMount() {
    this.props.onSetupEthereum()
  }

  render() {
    const { stats, balances, tcr } = this.props

    return (
      <Wrapper>
        <Banner tcr={tcr} />
        <Stats balances={balances} stats={stats} tcr={tcr} />
      </Wrapper>
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

const mapStateToProps = createStructuredSelector({
  balances: selectBalances,
  stats: selectStats,
  tcr: selectTCR,
})

const withConnect = connect(
  mapStateToProps,
  {
    onSetupEthereum: actions.setupEthereumStart,
  }
)
export default compose(
  withRouter,
  withConnect
)(toJS(Home))
