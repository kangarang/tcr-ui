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
  selectContracts,
  selectEthjs,
  selectRequest,
} from '../../selectors'
import { sendTransaction, sendTransactionRequest, callRequested } from '../../actions'

const VotingWrapper = styled.div`
  padding: 1em;
`

class Voting extends Component {
  componentDidMount() {
    console.log('Voting props', this.props)
    if (!this.props.account) {
      this.props.history.push('/')
    }
  }

  handleClick = e => {
    console.log('e', e)
    this.props.onSendTransactionRequest(e)
  }

  handleCall = e => {
    console.log('call:', e)
    this.props.onCall(e)
  }

  handleSendTransaction = e => {
    console.log('confirm txn:', e)
    this.props.onSendTransaction(e)
  }

  render() {
    const { wallet, faceoffs, ethjs, request } = this.props
    const reqMeth = request.get('method') ? request.get('method') : 'vote'
    const customMethods = methods[reqMeth].actions || []
    const customWarnings = methods[reqMeth].warning || []

    return (
      <VotingWrapper>
        <UserInfo {...this.props} />

        <UDapp
          isOpen={request.get('method').length > 0}
          messages={messages.vote}
          actions={customMethods}
          warnings={customWarnings}
          networkId={wallet.get('network')}
          handleSendTransaction={this.handleSendTransaction}
          handleCall={this.handleCall}
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
                  handleClick={this.handleClick}
                  ethjs={ethjs}
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
    onSendTransactionRequest: e => dispatch(sendTransactionRequest(e)),
    onSendTransaction: e => dispatch(sendTransaction(e)),
    onCall: e => dispatch(callRequested(e)),
  }
}

const mapStateToProps = createStructuredSelector({
  parameters: selectParameters,
  wallet: selectWallet,
  account: selectAccount,
  faceoffs: selectFaceoffs,
  error: selectError,
  contracts: selectContracts,
  ethjs: selectEthjs,
  request: selectRequest,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(withRouter(Voting))
