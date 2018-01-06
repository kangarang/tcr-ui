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
  selectAmount,
  selectParameters,
  selectListings,
  makeSelectCandidates,
  selectFaceoffs,
  selectWhitelist,
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
      faceoffs,
      members,
      parameters,
      onChangeUsername,
      idAmount,
      amount,
      onChangeAmount,
    } = this.props

    return (
      <div>

        <UserInfo
          account={parameters.get('account')}
          network={parameters.get('network')}
          ethBalance={ethereum.get('balance')}
          tokenBalance={ethereum.getIn(['token', 'balance'])}
          tokensAllowed={parameters.get('tokensAllowed')}
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
              <Section key={log.getIn(['block', 'number']) + log.get('domain')}>
                <Event
                  golem={log.get('golem')}
                  owner={log.get('owner')}
                  domain={log.get('domain')}

                  handleClickUpdateStatus={this.handleUpdateStatus}
                  handleClickChallenge={this.handleChallenge}
                  handleClickTest={this.handleTest}
                />
              </Section>
            ))}
        </FlexContainer>

        <H2>{'Challenges ('}{faceoffs.size}{')'}</H2>
        <FlexContainer>
          {faceoffs.size > 0 &&
            faceoffs.map(log => (
              <Section key={log.getIn(['block', 'number']) + log.get('domain')}>
                <Event
                  golem={log.get('golem')}
                  owner={log.get('owner')}
                  domain={log.get('domain')}

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
              <Section key={log.getIn(['block', 'number']) + log.get('domain')}>
                <Event
                  golem={log.get('golem')}
                  owner={log.get('owner')}
                  domain={log.get('domain')}

                  handleClickUpdateStatus={this.handleUpdateStatus}
                  handleClickTest={this.handleTest}
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
    // onChangeUsername: evt => dispatch(changeDomain(evt.target.value)),
    // onChangeAmount: evt => dispatch(changeAmount(evt.target.value)),
    onGetTokensAllowed: () => dispatch(getTokensAllowed()),
    onApprove: amount => dispatch(requestApproval(amount)),
    onApply: (domain, deposit) => dispatch(applyDomain(domain, deposit)),
    onChallenge: domain => dispatch(challengeDomain(domain)),
    onCommitVote: (domain, pollID, amount) => dispatch(commitVote(domain, pollID, amount)),
    onUpdateStatus: domain => dispatch(updateStatus(domain)),
    onTest: domain => dispatch(checkTest(domain)),
  }
}

const mapStateToProps = createStructuredSelector({
  parameters: selectParameters,
  listings: selectListings,
  candidates: makeSelectCandidates(),
  faceoffs: selectFaceoffs,
  members: selectWhitelist,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(App)
