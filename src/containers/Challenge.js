import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

import UDapp from './UDapp'
import messages from '../messages'

import H2 from '../components/H2'
import UserInfo from '../components/UserInfo'

import Listing from '../components/Listing'
import FlexContainer from '../components/FlexContainer'
import Section from '../components/Section'

import {
  selectWallet,
  selectCandidates,
  selectError,
  selectAccount,
  selectContracts,
  selectEthjs,
  selectRequest,
} from '../selectors'
import methods from '../methods'
import { sendTransactionRequest, sendTransaction } from '../actions/index';

const ChallengeWrapper = styled.div`
  padding: 1em;
`

class Challenge extends Component {

  componentDidMount() {
    console.log('challenge props', this.props)
    if (!this.props.account) {
      this.props.history.push('/')
    }
  }

  handleClick = (e) => {
    console.log('handle challenge click', e)
    this.props.onSendTransactionRequest(e)
  }

  handleSendTransaction = (e) => {
    console.log('confirm txn:', e)
    this.props.onSendTransaction(e)
  }
  render() {
    const { wallet, account, candidates, ethjs, error, contracts, request } = this.props
    const reqMeth = request.get('method') ? request.get('method') : 'home'
    console.log('reqMeth', reqMeth)
    const customMethods = methods[reqMeth].actions || []
    return (
      <ChallengeWrapper>
        <UserInfo account={account} error={error} wallet={wallet} contracts={contracts} />

        <UDapp
          isOpen={request.get('method').length > 0}
          messages={messages.challenge}
          account={account}
          actions={customMethods}
          networkId={wallet.get('network')}
          handleSendTransaction={this.handleSendTransaction}
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
                  handleClick={this.handleClick}
                />
              </Section>
            ))}
        </FlexContainer>
      </ChallengeWrapper>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSendTransactionRequest: (e) => dispatch(sendTransactionRequest(e)),
    onSendTransaction: (e) => dispatch(sendTransaction(e)),
  }
}

const mapStateToProps = createStructuredSelector({
  wallet: selectWallet,
  contracts: selectContracts,
  account: selectAccount,
  candidates: selectCandidates,
  error: selectError,
  ethjs: selectEthjs,
  request: selectRequest,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(withRouter(Challenge))
