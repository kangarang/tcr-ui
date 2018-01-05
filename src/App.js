import React, { Component } from 'react'

import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'

import H2 from './components/H2'
import Form from './components/Form'
import UserInfo from './components/UserInfo'

import Event from './components/Event'
import FlexContainer from './components/FlexContainer'
import Section from './components/Section'

import './global-styles'

import {
  setupEthereum,
  requestApproval,
  getTokensAllowed,
  changeDomain,
  changeAmount,
  applyDomain,
  commitVote,
  checkTest,
  challengeDomain,
  updateStatus,
} from './actions'

import {
  selectDomain,
  selectAmount,
  makeSelectUserInfo,
  selectRegistryItems,
  selectVotingItems,
  makeSelectCandidates,
  makeSelectWhitelistItems,
} from './selectors'

class App extends Component {
  componentDidMount() {
    this.setup()
  }

  setup = () => {
    this.props.onSetupEthereum()
  }

  handleGetTokensAllowed = e => {
    e.preventDefault()
    this.props.onGetTokensAllowed()
  }

  checkProvider = () => {
    this.intervalID = window.setInterval(
      () => this.props.onCheckProvider(),
      1000
    )
  }

  handleChallenge = (e, domain) => {
    e.preventDefault()
    this.props.onChallenge(domain)
  }

  handleApply = e => {
    e.preventDefault()
    this.props.onApply(this.props.domain, '50000')
    // this.props.onApply(this.props.domain, this.props.amount)
  }

  handleApprove = e => {
    e.preventDefault()
    const deposit = '1000000'
    this.props.onApprove(deposit)
  }

  handleCommitVote = (e, domain, pollID) => {
    e.preventDefault()
    this.props.onCommitVote(domain, pollID, this.props.amount)
  }

  handleUpdateStatus = (e, domain) => {
    e.preventDefault()
    this.props.onUpdateStatus(domain)
  }

  handleTest = (e, domain) => {
    e.preventDefault()
    this.props.onTest(domain)
  }

  handleSetVisibility = (e, vFilter) => {
    e.preventDefault()
    this.props.onSetVisibility(vFilter)
  }

  render() {
    const {
      domain,
      candidates,
      voting_items,
      members,
      userInfo,
      onChangeUsername,
      idAmount,
      amount,
      onChangeAmount,
    } = this.props

    return (
      <div>

        <UserInfo
          account={userInfo.get('account')}
          network={userInfo.get('network')}
          ethBalance={userInfo.get('ethBalance')}
          tokenBalance={userInfo.get('tokenBalance')}
          tokensAllowed={userInfo.get('tokensAllowed')}
          onApprove={this.handleApprove}
        />

        <Form
          onSubmit={this.handleApply}
          value={domain}
          onChange={onChangeUsername}
          id={domain}
          placeholder={'Applicant Name'}
          idAmount={idAmount}
          amountValue={amount}
          onChangeAmount={onChangeAmount}
        />

        <H2>{'Applicants ('}{candidates.size}{')'}</H2>
        <FlexContainer>
          {candidates.size > 0 &&
            candidates.map(log => (
              <Section key={log.get('blockNumber') + log.get('domain')}>
                <Event
                  blockHash={log.get('blockHash')}
                  blockNumber={log.get('blockNumber')}
                  timestamp={log.get('timestamp')}

                  txHash={log.get('txHash')}
                  txIndex={log.get('txIndex')}
                  account={log.get('from')}

                  domain={log.get('domain')}
                  unstakedDeposit={log.get('unstakedDeposit')}
                  pollID={log.get('pollID')}
                  logIndex={log.get('logIndex')}

                  event={log.get('event')}
                  status={log.get('status')}
                  whitelisted={log.get('whitelisted')}
                  canBeWhitelisted={log.get('canBeWhitelisted')}
                  handleClickUpdateStatus={this.handleUpdateStatus}
                  handleClickChallenge={this.handleChallenge}
                  handleClickTest={this.handleTest}
                />
              </Section>
            ))}
        </FlexContainer>

        <H2>{'Challenges ('}{voting_items.size}{')'}</H2>
        <FlexContainer>
          {voting_items.size > 0 &&
            voting_items.map(log => (
              <Section key={log.get('blockNumber') + log.get('domain')}>
                <Event
                  blockHash={log.get('blockHash')}
                  blockNumber={log.get('blockNumber')}
                  timestamp={log.get('timestamp')}

                  txHash={log.get('txHash')}
                  txIndex={log.get('txIndex')}
                  account={log.get('from')}

                  domain={log.get('domain')}
                  unstakedDeposit={log.get('unstakedDeposit')}
                  pollID={log.get('pollID')}
                  logIndex={log.get('logIndex')}

                  event={log.get('event')}
                  status={log.get('status')}
                  whitelisted={log.get('whitelisted')}
                  handleClickCommitVote={this.handleCommitVote}
                  handleClickUpdateStatus={this.handleUpdateStatus}
                  handleClickTest={this.handleTest}
                />
              </Section>
            ))}
        </FlexContainer>

        <H2>{'Members ('}{members.size}{')'}</H2>
        <FlexContainer>
          {members.size > 0 &&
            members.map(log => (
              <Section key={log.get('blockNumber') + log.get('domain')}>
                <Event
                  blockHash={log.get('blockHash')}
                  blockNumber={log.get('blockNumber')}
                  timestamp={log.get('timestamp')}

                  txHash={log.get('txHash')}
                  txIndex={log.get('txIndex')}
                  account={log.get('from')}

                  domain={log.get('domain')}
                  unstakedDeposit={log.get('unstakedDeposit')}
                  pollID={log.get('pollID')}
                  logIndex={log.get('logIndex')}

                  event={log.get('event')}
                  status={log.get('status')}
                  whitelisted={log.get('whitelisted')}
                  handleClickTest={this.handleTest}
                  handleClickChallenge={this.handleChallenge}
                />
              </Section>
            ))}
        </FlexContainer>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSetupEthereum: () => dispatch(setupEthereum()),
    onChangeUsername: evt => dispatch(changeDomain(evt.target.value)),
    onChangeAmount: evt => dispatch(changeAmount(evt.target.value)),
    onApprove: amount => dispatch(requestApproval(amount)),
    onApply: (domain, deposit) => dispatch(applyDomain(domain, deposit)),
    onChallenge: domain => dispatch(challengeDomain(domain)),
    onCommitVote: (domain, pollID, amount) => dispatch(commitVote(domain, pollID, amount)),
    onGetTokensAllowed: () => dispatch(getTokensAllowed()),
    onUpdateStatus: domain => dispatch(updateStatus(domain)),
    onTest: domain => dispatch(checkTest(domain)),
  }
}

const mapStateToProps = createStructuredSelector({
  userInfo: makeSelectUserInfo(),
  domain: selectDomain,
  amount: selectAmount,
  registry_items: selectRegistryItems,
  voting_items: selectVotingItems,
  members: makeSelectWhitelistItems(),
  candidates: makeSelectCandidates(),
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(App)
