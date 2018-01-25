import 'babel-polyfill'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'
import NetworkStatus from 'react-web3-network-status'

import Login from '../Login'
import messages from '../../config/messages'
import methods from '../../config/methods'
import Modal from '../Modal'

import UserInfo from '../../components/UserInfo'

import tcrWave from '../../assets/tcr-wave.jpg'

import { setupEthereum, executeMethod } from '../../actions'

import {
  selectError,
  selectAccount,
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
    this.props.onSetupEthereum()
  }

  handleChangeRegistryAddress = e => {
    this.setState({
      registryAddress: e.target.value,
    })
  }

  render() {
    const { error, account, wallet, contracts } = this.props

    return (
      <HomeWrapper>
        <UserInfo
          account={account}
          error={error}
          wallet={wallet}
          contracts={contracts}
        />

        <Login
          execute={this.props.onExecute}
          network={wallet.get('network')}
          NetworkStatus={<NetworkStatus />}
          ns={NetworkStatus}
          ethBalance={wallet.get('ethBalance')}
          account={account}
          imgSrc={tcrWave}
          isOpen={false}
          messages={messages.login}
          onChange={this.handleChangeRegistryAddress}
          registryValue={this.state.registryAddress}
          registryPH={contracts.getIn(['registry', 'address'])}
          tokenBalance={wallet.getIn(['token', 'tokenBalance'])}
          tokenSymbol={wallet.getIn(['token', 'tokenSymbol'])}
          tokenName={wallet.getIn(['token', 'tokenName'])}
        />

        <Modal
          isOpen={false}
          messages={messages.apply}
          actions={methods.apply.actions}
          contracts={contracts}
          account={account}
          networkId={wallet.get('network')}
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
  wallet: selectWallet,
  contracts: selectContracts,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(Home)
