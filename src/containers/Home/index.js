import 'babel-polyfill'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'
import NetworkStatus from 'react-web3-network-status'

import Login from '../Login'
import messages from '../../messages'

import H2 from '../../components/H2'
import UserInfo from '../../components/UserInfo'

import Event from '../../components/Event'
import FlexContainer from '../../components/FlexContainer'
import Section from '../../components/Section'

import tcrWave from '../../assets/tcr-wave.jpg'

import { setupEthereum, executeMethod } from '../../actions'

import {
  selectError,
  selectAccount,
  selectCandidates,
  selectParameters,
  selectWallet,
  selectContracts,
} from '../../selectors'

const HomeWrapper = styled.div`
  padding: 1em;
`

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      registryAddress: ''
    }
  }
  componentDidMount() {
    console.log('Home props:', this.props)
    this.props.onSetupEthereum('ganche')
  }

  selectNetwork(network) {
    this.props.onSetupEthereum(network)
  }

  handleChangeRegistryAddress = e => {
    this.setState({
      registryAddress: e.target.value,
    })
  }

  render() {
    const { error, account, parameters, wallet, candidates, contracts } = this.props

    return (
      <HomeWrapper>
        <Login
          execute={this.props.onExecute}
          network={wallet.get('network')}
          networkStatus={<NetworkStatus />}
          ethBalance={wallet.get('ethBalance')}
          account={account}
          imgSrc={tcrWave}
          isOpen={false}
          messages={messages.login}
          onChange={this.handleChangeRegistryAddress}
          registryValue={this.state.registryAddress}
          registryPH={contracts.getIn(['registry', 'address'])}
        />

        <UserInfo
          network={wallet.get('network')}
          account={account}
          error={error}
          ethBalance={wallet.get('ethBalance')}
          tokenBalance={wallet.getIn(['token', 'tokenBalance'])}
          tokensAllowed={wallet.getIn([
            'token',
            'allowances',
            'registry',
            'total',
          ])}
          onSelectNetwork={this.selectNetwork}
        />
      </HomeWrapper>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSetupEthereum: network => dispatch(setupEthereum(network)),
    onExecute: payload => dispatch(executeMethod(payload)),
  }
}

const mapStateToProps = createStructuredSelector({
  error: selectError,
  account: selectAccount,
  candidates: selectCandidates,
  parameters: selectParameters,
  wallet: selectWallet,
  contracts: selectContracts,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(Home)
