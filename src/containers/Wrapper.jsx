import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import Notifications from 'react-notification-system-redux'
import { MuiThemeProvider } from '@material-ui/core/styles'

import { muiTheme } from '../global-styles'
import './Wrapper.css'

import { selectNetwork, selectNotifications } from 'modules/home/selectors'
import * as actions from 'modules/home/actions'

import TransactionsProvider from 'containers/Transactions'
import Registries from 'components/Registries'
import Header from 'components/Header'
import toJS from 'components/toJS'

const notificationStyles = {
  NotificationItem: {
    DefaultStyle: {
      margin: '10px 5px 2px 5px',
      width: '400px',
    },
    info: {},
  },
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  margin: 0;
`

class WrapperClass extends Component {
  state = {
    visibleRegistries: false,
  }
  // Toggles visibility of Registry picker
  handleToggleRegistries = () => {
    this.setState(prevState => ({
      visibleRegistries: !prevState.visibleRegistries,
    }))
  }
  // Dispatches SELECT_REGISTRY_CONTRACT action
  handleSelectRegistry = tcr => {
    const { onSelectRegistry, history, match } = this.props
    this.setState({ visibleRegistries: false })
    history.push(
      `/${tcr.registryAddress.slice(0, 8)}/${match.params.filter || 'whitelist'}`
    )
    onSelectRegistry(tcr)
  }
  // Directs to root route
  handleGoHome = () => {
    this.props.history.push('/')
  }

  render() {
    const { network, notifications, children } = this.props

    return (
      <Wrapper>
        <MuiThemeProvider theme={muiTheme}>
          <Header
            onHandleToggleRegistries={this.handleToggleRegistries}
            onHandleGoHome={this.handleGoHome}
          />

          {this.state.visibleRegistries && (
            <Registries network={network} onSelectRegistry={this.handleSelectRegistry} />
          )}

          {children}

          <TransactionsProvider />
          <Notifications style={notificationStyles} notifications={notifications} />
        </MuiThemeProvider>
      </Wrapper>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  network: selectNetwork,
  notifications: selectNotifications,
})

const withConnect = connect(
  mapStateToProps,
  {
    onSelectRegistry: actions.selectRegistryStart,
  }
)
export default compose(
  withRouter,
  withConnect
)(toJS(WrapperClass))
