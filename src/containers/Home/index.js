import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'

import Login from '../Login'
import messages from '../messages'
import methods from '../methods'
import UDapp from '../UDapp'

import H2 from '../../components/H2'

import Listing from '../../components/Listing'
import FlexContainer from '../../components/FlexContainer'
import Section from '../../components/Section'
import UserInfo from '../../components/UserInfo'

// import tcrWave from '../../assets/tcr-wave.jpg'

import {
  setupEthereum,
  requestModalMethod,
  sendTransaction,
  callRequested,
} from '../../actions'

import {
  selectError,
  selectAccount,
  selectWallet,
  selectAllContracts,
  selectECRecovered,
  selectWhitelist,
  selectEthjs,
  selectRequest,
  selectPrerequisites,
  selectCandidates,
} from '../../selectors'

const HomeWrapper = styled.div`
  padding: 1em;
`

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      registryAddress: '',
      modalIsOpen: false,
    }
  }
  componentDidMount() {
    this.props.onSetupEthereum()
  }

  handleCall = e => {
    console.log('call:', e)
    this.props.onCall(e)
  }
  handleSendTransaction = e => {
    console.log('send txn:', e)
    this.props.onSendTransaction(e)
  }

  handleClickListing = e => {
    console.log('click listing', e)
    this.props.onRequestModalMethod(e)
    this.setState({
      modalIsOpen: 'apply',
    })
  }

  handleAfterOpen = () => {
    console.log('after open')
  }
  handleRequestClose = () => {
    console.log('request close')
    this.setState({ modalIsOpen: false })
  }
  openModal = () => {
    this.props.onRequestModalMethod({method: 'apply', context: {}})
    this.setState({ modalIsOpen: 'apply' })
  }
  closeModal = () => {
    this.setState({ modalIsOpen: false })
  }

  render() {
    const {
      // account,
      wallet,
      // contracts,
      whitelist,
      // ecRecovered,
      candidates,
      request,
    } = this.props

    const reqMeth =
      request.get('method') && !request.get('context')
        ? 'apply'
        : request.get('method') ? request.get('method') : 'apply'
    const customMethods = methods[reqMeth].actions || []
    const customWarnings = methods[reqMeth].warning || []

    return (
      <div>
        <HomeWrapper>
          {/* {!ecRecovered && (
            <Login
              execute={this.handleLogin}
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
          )} */}

          <UserInfo {...this.props} />

          <UDapp
            modalIsOpen={this.state.modalIsOpen}
            default={'apply'}
            messages={messages.apply}
            defaultMethods={methods.apply.actions}
            actions={customMethods}
            warnings={customWarnings}
            networkId={wallet.get('network')}
            handleSendTransaction={this.handleSendTransaction}
            handleCall={this.handleCall}
            onRequestClose={this.handleRequestCloseModal}
            onAfterOpen={this.handleAfterOpen}
            openModal={this.openModal}
            closeModal={this.closeModal}
            {...this.props}
          />

          <H2>
            {'Applicants ('}
            {candidates.size}
            {')'}
          </H2>
          <FlexContainer>
            {candidates.size > 0 &&
              candidates.map(log => (
                <Section key={log.get('listing')}>
                  <Listing
                    latest={log.get('latest')}
                    owner={log.get('owner')}
                    listing={log.get('listing')}
                    whitelisted={log.getIn(['latest', 'whitelisted'])}
                    handleClick={this.handleClickListing}
                  />
                </Section>
              ))}
          </FlexContainer>
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
                    handleClick={this.handleClickListing}
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
    onRequestModalMethod: e => dispatch(requestModalMethod(e)),
    onSendTransaction: payload => dispatch(sendTransaction(payload)),
    onCall: payload => dispatch(callRequested(payload)),
  }
}

const mapStateToProps = createStructuredSelector({
  error: selectError,
  account: selectAccount,
  wallet: selectWallet,
  contracts: selectAllContracts,
  whitelist: selectWhitelist,
  ecRecovered: selectECRecovered,
  ethjs: selectEthjs,
  request: selectRequest,
  candidates: selectCandidates,
  prerequisites: selectPrerequisites,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(Home)
