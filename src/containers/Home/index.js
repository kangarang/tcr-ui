import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'

import { selectBalances, selectTCR, selectStats } from 'modules/home/selectors'
import * as actions from 'modules/home/actions'

import Registry from 'containers/Registry'
import Wrapper from 'containers/Wrapper'
import Banner from 'components/Banner'
import Stats from 'components/Stats'
import toJS from 'components/toJS'

class Home extends Component {
  componentDidMount() {
    this.props.onSetupEthereum()
  }

  render() {
    const { stats, balances, tcr, match, history } = this.props

    return (
      <Wrapper>
        <Banner tcr={tcr} />
        <Stats balances={balances} stats={stats} tcr={tcr} />
        <Registry match={match} history={history} />
      </Wrapper>
    )
  }
}

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
