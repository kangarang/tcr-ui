import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

import UDapp from '../UDapp'
import messages from '../messages'
import methods from '../methods'

import H2 from '../../components/H2'
import FlexContainer from '../../components/FlexContainer'
import Listing from '../../components/Listing'
import Section from '../../components/Section'
import UserInfo from '../../components/UserInfo'

import {
  selectParameters,
  selectWallet,
  selectFaceoffs,
  selectError,
  selectAccount,
  selectAllContracts,
  selectEthjs,
  selectRequest,
  selectPrerequisites,
} from '../../selectors'
import {
  sendTransaction,
  requestModalMethod,
  callRequested,
  commitVote,
} from '../../actions'

const VotingWrapper = styled.div`
  padding: 1em;
`

class Voting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalIsOpen: false,
    }
  }
  componentDidMount() {
    if (!this.props.account) {
      this.props.history.push('/')
    }
  }

  handleCall = e => {
    console.log('call:', e)
    this.props.onCall(e)
  }
  handleSendTransaction = e => {
    console.log('confirm txn:', e)
    // this.props.onSendTransaction(e)
    this.props.onTxCommitVote(e)
  }

  handleClickListing = e => {
    console.log('click listing', e)
    this.props.onRequestModalMethod(e)
    this.setState({
      modalIsOpen: 'vote',
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
    this.setState({ modalIsOpen: 'vote' })
  }
  closeModal = () => {
    this.setState({ modalIsOpen: false })
  }

  render() {
    const { wallet, faceoffs, request } = this.props
    const reqMeth =
      request.get('method') && !request.get('context')
        ? 'vote'
        : request.get('method') ? request.get('method') : 'vote'
    const customMethods = methods[reqMeth].actions || []
    const customWarnings = methods[reqMeth].warning || []

    return (
      <VotingWrapper>
        <UserInfo {...this.props} />

        <UDapp
          modalIsOpen={this.state.modalIsOpen}
          default={'vote'}
          messages={messages.vote}
          defaultMethods={methods.vote.actions}
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
          {'Challenges ('}
          {faceoffs.size}
          {')'}
        </H2>
        <FlexContainer>
          {faceoffs.size > 0 &&
            faceoffs.map(log => (
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
      </VotingWrapper>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onRequestModalMethod: e => dispatch(requestModalMethod(e)),
    onSendTransaction: e => dispatch(sendTransaction(e)),
    onTxCommitVote: e => dispatch(commitVote(e)),
    onCall: e => dispatch(callRequested(e)),
  }
}

const mapStateToProps = createStructuredSelector({
  parameters: selectParameters,
  wallet: selectWallet,
  account: selectAccount,
  faceoffs: selectFaceoffs,
  error: selectError,
  contracts: selectAllContracts,
  ethjs: selectEthjs,
  request: selectRequest,
  prerequisites: selectPrerequisites,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(withRouter(Voting))
