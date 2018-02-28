import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'
import { DropDown, SidePanel } from '@aragon/ui'

import messages from '../messages'
import methods from '../methods'
import TransactionContainer from '../TransactionContainer'

import H2 from '../../components/H2'

import Listing from '../../components/Listing'
import FlexContainer from '../../components/FlexContainer'
import Section from '../../components/Section'
import UserInfo from '../../components/UserInfo'

import {
  setupEthereum,
  requestModalMethod,
  sendTransaction,
  callRequested,
} from '../../actions'

import {
  selectEthjs,
  selectAccount,
  selectNetworkID,
  selectBalances,
  selectRegistry,
  selectToken,
  selectVoting,
  selectParameters,
  selectCandidates,
  selectFaceoffs,
  selectWhitelist,
  selectMiningStatus,
} from '../../selectors'
import MiningOverlay from '../../components/MiningOverlay';

const CandidatesContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 1em;
  /* background-color: rgba(0, 0, 0, 0.2); */
`

const HomeWrapper = styled.div`
  padding: 1em;
`

const items = [
  'Wandering Thunder',
  'Black Wildflower',
  'Ancient Paper',
]


class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      registryAddress: '',
      modalIsOpen: false,
      selectedListing: false,
      actions: [],
      activeItem: 0,
      opened: true,
    }
  }
  componentDidMount() {
    this.props.onSetupEthereum()
  }
  handleRequestClose = () => {
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
    this.props.onCall(e)
  }
  handleSendTransaction = (txObj) => {
    console.log('react send transaction:', txObj)
    this.props.onSendTransaction(txObj)
    // this.props.onSendTransaction({ args: e.args, method: e.method, listing: this.state.selectedListing })
  }
  handleClickListing = e => {
    console.log('handle click listing', e)
    this.props.onRequestModalMethod(e)
    this.setState({
      modalIsOpen: true,
      selectedListing: e.context.listing,
      actions: [e.method],
    })
  }

  handleDropDownChange = (index) => {
    console.log('handle dropdown change', index)
    this.setState({ activeItem: index })
  }

  closeSidePanel = () => {
    this.setState({ opened: false })
  }
  render() {
    const {
      candidates,
      faceoffs,
      whitelist,
      balances,
      networkID,
      parameters,
      miningStatus,
    } = this.props

    return (
      <div>
        <HomeWrapper>

          <UserInfo {...this.props} />

          <DropDown
            items={items}
            active={this.state.activeItem}
            onChange={this.handleDropDownChange}
          />

          <MiningOverlay
            open={this.props.miningStatus.get('open')}
            message={this.props.miningStatus.get('message')}
          />

          {/* <SidePanel title="Checkout Details" opened={this.state.opened} onClose={this.closeSidePanel}>
            {'side panel'}
          </SidePanel> */}

          <TransactionContainer
            modalIsOpen={this.state.modalIsOpen}
            messages={messages.apply}
            actions={this.state.actions}
            networkId={networkID}
            handleSendTransaction={this.handleSendTransaction}
            handleCall={this.handleCall}
            onRequestClose={this.handleRequestCloseModal}
            openModal={e => this.openModal(['apply'])}
            closeModal={this.closeModal}
            tokenBalance={balances.get('token')}
            votingRights={balances.get('votingRights')}
            votingAllowance={balances.get('votingAllowance')}
            registryAllowance={balances.get('registryAllowance')}
            {...this.props}
          />

          {/* <TransactionContainer
            modalIsOpen={this.state.modalIsOpen}
            messages={messages.vote}
            actions={this.state.actions}
            networkId={wallet.get('network')}
            handleSendTransaction={this.handleSendTransaction}
            handleCall={this.handleCall}
            onRequestClose={this.handleRequestCloseModal}
            openModal={e => this.openModal(methods.vote.actions)}
            closeModal={this.closeModal}
            tokenBalance={balances.get('token')}
            votingRights={balances.get('votingRights')}
            votingAllowance={balances.get('votingAllowance')}
            registryAllowance={balances.get('registryAllowance')}
            {...this.props}
          /> */}

          <H2>
            {'Applications ('}
            {candidates.size}
            {')'}
          </H2>
          <CandidatesContainer>
            {candidates.size > 0 &&
              candidates.map(log => (
                <Section key={log.get('listingString')}>
                  <Listing
                    log={log}
                    latest={log.get('latest')}
                    owner={log.get('owner')}
                    listingString={log.get('listingString')}
                    whitelisted={log.getIn(['latest', 'whitelisted'])}
                    handleClick={this.handleClickListing}
                    actions={['challenge', 'updateStatus']}
                  />
                </Section>
              ))}
          </CandidatesContainer>

          <H2>
            {'Challenges ('}
            {faceoffs.size}
            {')'}
          </H2>
          <FlexContainer>
            {faceoffs.size > 0 &&
              faceoffs.map(log => (
                <Section key={log.get('listingString')}>
                  <Listing
                    log={log}
                    latest={log.get('latest')}
                    owner={log.get('owner')}
                    listingString={log.get('listingString')}
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
                <Section key={log.get('listingString')}>
                  <Listing
                    log={log}
                    latest={log.get('latest')}
                    owner={log.get('owner')}
                    listingString={log.get('listingString')}
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
  ethjs: selectEthjs,
  account: selectAccount,
  networkID: selectNetworkID,

  balances: selectBalances,
  miningStatus: selectMiningStatus,

  registry: selectRegistry,
  token: selectToken,
  voting: selectVoting,

  parameters: selectParameters,

  candidates: selectCandidates,
  faceoffs: selectFaceoffs,
  whitelist: selectWhitelist,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(Home)
