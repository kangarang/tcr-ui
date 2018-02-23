import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'

// import Login from '../Login'
import messages from '../messages'
import methods from '../methods'
import TransactionContainer from '../TransactionContainer'

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
  selectMinDeposit,
  selectRegistry,
  selectVoting,
  selectToken,
  selectFaceoffs,
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
      selectedListing: false,
      actions: [],
    }
  }
  componentDidMount() {
    this.props.onSetupEthereum()
  }
  handleAfterOpen = () => {
    console.log('after open')
  }
  handleRequestClose = () => {
    console.log('request close')
    this.setState({ modalIsOpen: false })
  }
  openModal = (actions) => {
    this.props.onRequestModalMethod({ method: 'apply', context: {} })
    this.setState({
      modalIsOpen: true,
      actions
    })
  }
  closeModal = () => {
    this.setState({ modalIsOpen: false })
  }

  handleFileInput = e => {
    const file = e.target.files[0]
    const fr = new window.FileReader()

    fr.onload = () => {
      const contents = fr.result
      console.log('contents', contents)

      try {
        const jsonFC = JSON.parse(contents)
        console.log('jsonFC', jsonFC)
        console.log('salt', jsonFC.salt)
        console.log('voteOption', jsonFC.voteOption)

      } catch (error) {
        throw new Error('Invalid Commit JSON file')
      }
    }

    fr.readAsText(file)
  }
  handleCall = e => {
    console.log('call:', e)
    this.props.onCall(e)
  }
  handleSendTransaction = (txObj) => {
    console.log('send txn:', txObj)
    this.props.onSendTransaction(txObj)
    // this.props.onSendTransaction({ args: e.args, method: e.method, listing: this.state.selectedListing })
  }
  handleClickListing = e => {
    console.log('click listing', e)
    this.props.onRequestModalMethod(e)
    this.setState({
      modalIsOpen: true,
      selectedListing: e.context.listing,
      actions: [e.method],
    })
  }

  render() {
    const {
      // account,
      wallet,
      // contracts,
      faceoffs,
      whitelist,
      // ecRecovered,
      candidates,
      request,
    } = this.props

    const reqMeth =
      request.get('method') && !request.get('context')
        ? 'apply'
        : request.get('method') ? request.get('method') : 'apply'

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

          <TransactionContainer
            modalIsOpen={this.state.modalIsOpen}
            messages={messages.apply}
            actions={this.state.actions}
            warnings={customWarnings}
            networkId={wallet.get('network')}
            handleSendTransaction={this.handleSendTransaction}
            handleCall={this.handleCall}
            onRequestClose={this.handleRequestCloseModal}
            onAfterOpen={this.handleAfterOpen}
            openModal={e => this.openModal(['apply'])} // index
            closeModal={this.closeModal}
            tokenBalance={wallet.getIn(['token', 'tokenBalance'])}
            votingRights={wallet.getIn(['token', 'allowances', this.props.voting.address, 'votingrights'])}
            votingAllowance={wallet.getIn(['token', 'allowances', this.props.voting.address, 'total'])}
            registryAllowance={wallet.getIn(['token', 'allowances', this.props.registry.address, 'total'])}
            {...this.props}
          />

          <TransactionContainer
            modalIsOpen={this.state.modalIsOpen}
            messages={messages.vote}
            actions={this.state.actions}
            warnings={customWarnings}
            networkId={wallet.get('network')}
            handleSendTransaction={this.handleSendTransaction}
            handleCall={this.handleCall}
            // handleCommitVote={this.handleCommitVote}
            // handleRevealVote={this.handleRevealVote}
            // handleRequestVotingRights={this.handleRequestVotingRights}
            onRequestClose={this.handleRequestCloseModal}
            onAfterOpen={this.handleAfterOpen}
            openModal={e => this.openModal(methods.vote.actions)}
            closeModal={this.closeModal}
            tokenBalance={wallet.getIn(['token', 'tokenBalance'])}
            votingRights={wallet.getIn(['token', 'allowances', this.props.voting.address, 'votingrights'])}
            votingAllowance={wallet.getIn(['token', 'allowances', this.props.voting.address, 'total'])}
            registryAllowance={wallet.getIn(['token', 'allowances', this.props.registry.address, 'total'])}
            {...this.props}
          />

          {/* <UDapp
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
            tokenBalance={wallet.getIn(['token', 'tokenBalance'])}
            votingRights={wallet.getIn(['token', 'allowances', this.props.voting.address, 'votingrights'])}
            votingAllowance={wallet.getIn(['token', 'allowances', this.props.voting.address, 'total'])}
            registryAllowance={wallet.getIn(['token', 'allowances', this.props.registry.address, 'total'])}
            {...this.props}
          /> */}

          <H2>
            {'Applications ('}
            {candidates.size}
            {')'}
          </H2>
          <FlexContainer>
            {candidates.size > 0 &&
              candidates.map(log => (
                <Section key={log.get('listing')}>
                  <Listing
                    log={log}
                    latest={log.get('latest')}
                    owner={log.get('owner')}
                    listing={log.get('listing')}
                    whitelisted={log.getIn(['latest', 'whitelisted'])}
                    // status={log.getIn(['latest', 'status'])}
                    handleClick={this.handleClickListing}
                    actions={['challenge', 'updateStatus']}
                  />
                </Section>
              ))}
          </FlexContainer>

          <H2>
            {'Challenges ('}
            {faceoffs.size}
            {')'}
          </H2>
          <FlexContainer>
            {faceoffs.size > 0 &&
              faceoffs.map(log => (
                <Section key={log.get('listing')}>
                  <Listing
                    log={log}
                    latest={log.get('latest')}
                    owner={log.get('owner')}
                    listing={log.get('listing')}
                    whitelisted={log.getIn(['latest', 'whitelisted'])}
                    handleClick={this.handleClickListing}
                    onFileInput={this.handleFileInput}
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
                    log={log}
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
  faceoffs: selectFaceoffs,
  prerequisites: selectPrerequisites,
  minDeposit: selectMinDeposit,
  registry: selectRegistry,
  voting: selectVoting,
  token: selectToken,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(Home)
