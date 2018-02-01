import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'
// import NetworkStatus from 'react-web3-network-status'

import Login from './Login'
import messages from '../messages'
import methods from '../methods'
import UDapp from './UDapp'

import H2 from '../components/H2'

import Listing from '../components/Listing'
import FlexContainer from '../components/FlexContainer'
import Section from '../components/Section'
import UserInfo from '../components/UserInfo'

import tcrWave from '../assets/tcr-wave.jpg'

import { setupEthereum, sendTransaction } from '../actions'

import {
  selectError,
  selectAccount,
  selectWallet,
  selectContracts,
  selectECRecovered,
  selectWhitelist,
  selectEthjs,
  selectRequest,
} from '../selectors'

const HomeWrapper = styled.div`
  padding: 1em;
`

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      registryAddress: '',
    }
  }

  componentDidMount() {
    this.props.onSetupEthereum()
    console.log('Home props:', this.props)
  }

  handleChangeRegistryAddress = e => {
    this.setState({
      registryAddress: e.target.value,
    })
  }

  render() {
    const {
      error,
      account,
      wallet,
      contracts,
      whitelist,
      ethjs,
      ecRecovered,
      request,
    } = this.props
    console.log('HOME: ', this)

    return (
      <div>
        <HomeWrapper>
          {ecRecovered && (
            <Login
              execute={this.props.onExecute}
              network={wallet.get('network')}
              // NetworkStatus={<NetworkStatus />}
              // ns={NetworkStatus}
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
              ecRecovered={ecRecovered}
            />
          )}

          <UserInfo
            account={account}
            error={error}
            wallet={wallet}
            contracts={contracts}
            request={request}
            {...this.props}
          />

          <UDapp
            isOpen={false}
            messages={messages.apply}
            actions={methods.apply.actions}
            contracts={contracts}
            account={account}
            networkId={wallet.get('network')}
            wallet={wallet}
            ethjs={ethjs}
            {...this.props}
          />

          <H2>
            {'Registry ('}
            {whitelist.size}
            {')'}
          </H2>
          <FlexContainer>
            {whitelist.size > 0 &&
              whitelist.map(log => (
                <Section key={log.get('listing')}>
                  <Listing
                    latest={log.get('latest')}
                    owner={log.get('owner')}
                    listing={log.get('listing')}
                    whitelisted={log.getIn(['latest', 'whitelisted'])}
                  />
                </Section>
              ))}
          </FlexContainer>
        </HomeWrapper>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSetupEthereum: network => dispatch(setupEthereum(network)),
    handleSendTransaction: payload => dispatch(sendTransaction(payload)),
  }
}

const mapStateToProps = createStructuredSelector({
  error: selectError,
  account: selectAccount,
  wallet: selectWallet,
  contracts: selectContracts,
  whitelist: selectWhitelist,
  ecRecovered: selectECRecovered,
  ethjs: selectEthjs,
  request: selectRequest,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(Home)
