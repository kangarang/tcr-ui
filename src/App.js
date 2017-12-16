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

import './App.css'

import {
  setupEthereum,
  requestApproval,
  getTokensAllowed,
  changeDomain,
  applyDomain,
  challengeDomain,
  updateStatus,
} from './actions'

import {
  selectDomain,
  makeSelectUserInfo,
  selectRegistryItems,
  // selectVotingItems,
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
  }

  handleApprove = e => {
    e.preventDefault()
    const deposit = '1000000'
    this.props.onApprove(deposit)
  }

  handleUpdateStatus = (e, domain) => {
    e.preventDefault()
    this.props.onUpdateStatus(domain)
  }

  handleSetVisibility = (e, vFilter) => {
    e.preventDefault()
    this.props.onSetVisibility(vFilter)
  }

  render() {
    const {
      domain,
      candidates,
      // voting_items,
      members,
      userInfo,
      onChangeUsername,
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

        <Section>
          <Form
            onSubmit={this.handleApply}
            value={domain}
            onChange={onChangeUsername}
            id={domain}
            placeholder={'Lil Pump'}
          />
        </Section>

        <H2>{'Gucci Gang Candidates'}</H2>
        <FlexContainer>
          {candidates.size > 0 &&
            candidates.map(log => (
              <Section key={log.get('blockNumber') + log.get('domain')}>
                <Event
                  domain={log.get('domain')}
                  value={log.get('unstakedDeposit')}
                  blockHash={log.get('blockHash')}
                  blockNumber={log.get('blockNumber')}
                  txHash={log.get('txHash')}
                  txIndex={log.get('txIndex')}
                  logIndex={log.get('logIndex')}
                  event={log.get('event')}
                  challengeID={log.get('challengeID')}
                  status={log.get('status')}
                  account={log.get('from')}
                  whitelisted={log.get('whitelisted')}
                  buttonClick={this.handleUpdateStatus}
                  buttonText={'Update Gucc Status'}
                />
              </Section>
            ))}
        </FlexContainer>

        {/* <H2>{'Gucci Gang Challenges'}</H2>
        <FlexContainer>
          {voting_items.size > 0 &&
            voting_items.map(log => (
              <Section key={log.get('blockNumber') + log.get('domain')}>
                <Event
                  domain={log.get('domain')}
                  value={log.get('unstakedDeposit')}
                  blockHash={log.get('blockHash')}
                  blockNumber={log.get('blockNumber')}
                  txHash={log.get('txHash')}
                  txIndex={log.get('txIndex')}
                  logIndex={log.get('logIndex')}
                  event={log.get('event')}
                  challengeID={log.get('challengeID')}
                  status={log.get('status')}
                  account={log.get('from')}
                  whitelisted={log.get('whitelisted')}
                  buttonClick={this.handleCommitVote}
                  buttonText={'Vote for this Gucc'}
                />
              </Section>
            ))}
        </FlexContainer> */}

        <H2>{'Gucci Gang Members'}</H2>
        <FlexContainer>
          {members.size > 0 &&
            members.map(log => (
              <Section key={log.get('blockNumber') + log.get('domain')}>
                <Event
                  domain={log.get('domain')}
                  value={log.get('unstakedDeposit')}
                  blockHash={log.get('blockHash')}
                  blockNumber={log.get('blockNumber')}
                  txHash={log.get('txHash')}
                  txIndex={log.get('txIndex')}
                  logIndex={log.get('logIndex')}
                  event={log.get('event')}
                  challengeID={log.get('challengeID')}
                  status={log.get('status')}
                  account={log.get('from')}
                  whitelisted={log.get('whitelisted')}
                  buttonClick={this.handleChallenge}
                  buttonText={'Challenge The Gucc'}
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
    onApprove: amount => dispatch(requestApproval(amount)),
    onApply: (domain, deposit) => dispatch(applyDomain(domain, deposit)),
    onChallenge: domain => dispatch(challengeDomain(domain)),
    onGetTokensAllowed: () => dispatch(getTokensAllowed()),
    onUpdateStatus: domain => dispatch(updateStatus(domain)),
  }
}

const mapStateToProps = createStructuredSelector({
  userInfo: makeSelectUserInfo(),
  domain: selectDomain,
  registry_items: selectRegistryItems,
  // voting_items: selectVotingItems,
  members: makeSelectWhitelistItems(),
  candidates: makeSelectCandidates(),
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(App)
