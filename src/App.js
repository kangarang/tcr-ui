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
  applyDomain,
  commitVote,
  checkTest,
  challengeDomain,
  updateStatus,
} from './actions'

import {
  selectParameters,
  selectWallet,
  selectAllListingsByDomain,
  selectCandidates,
  selectFaceoffs,
  selectWhitelist,
  selectAccount,
} from './selectors'

class App extends Component {
  constructor() {
    super()
    this.state = {
      domain: '',
      deposit: '',
    }
  }

  componentDidMount() {
    this.props.onSetupEthereum()
  }

  checkProvider = () => {
    this.intervalID = window.setInterval(
      () => this.props.onCheckProvider(),
      1000
    )
  }

  handleApprove = e => {
    e.preventDefault()
    const deposit = '1000000'
    this.props.onApprove(deposit)
  }

  handleApply = e => {
    e.preventDefault()
    this.props.onApply(this.state.domain, '50000')
  }

  handleChallenge = (e, domain) => {
    e.preventDefault()
    this.props.onChallenge(domain)
  }

  handleUpdateStatus = (e, domain) => {
    e.preventDefault()
    this.props.onUpdateStatus(domain)
  }

  handleCommitVote = (e, domain, pollID) => {
    e.preventDefault()
    this.props.onCommitVote(domain, pollID, this.props.amount)
  }

  handleTest = (e, domain) => {
    e.preventDefault()
    this.props.onTest(domain)
  }

  handleChangeDeposit = (e) => {
    console.log('e', e)
    this.setState({
      deposit: e.target.value
    })
  }

  handleChangeDomain = (e) => {
    this.setState({
      domain: e.target.value
    })
  }

  handleSetVisibility = (e, vFilter) => {
    e.preventDefault()
    this.props.onSetVisibility(vFilter)
  }

  render() {
    const {
      wallet,
      account,
      candidates,
      faceoffs,
      registryListings,
      parameters,
    } = this.props

    return (
      <div>
        <UserInfo
          network={parameters.get('network')}
          account={account}
          ethBalance={wallet.get('ethBalance')}
          tokenBalance={wallet.getIn(['token', 'tokenBalance'])}
          tokensAllowed={wallet.getIn(['token', 'allowances', 'registry', 'total'])}
          onApprove={this.handleApprove}
        />

        <Form
          placeholder={'Domain'}
          // id={this.state.domain}
          value={this.state.domain}
          onChange={this.handleChangeDomain}
          depositValue={this.state.deposit}
          onChangeDeposit={this.handleChangeDeposit}
          onSubmit={this.handleApply}
        />

        <H2>{'Applicants ('}{candidates.size}{')'}</H2>
        <FlexContainer>
          {candidates.size > 0 &&
            candidates.map(log => (
              <Section key={log.get('domain')}>
                <Event
                  latest={log.get('latest')}
                  owner={log.get('owner')}
                  domain={log.get('domain')}
                  whitelisted={log.getIn(['latest', 'whitelisted'])}

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
              <Section key={log.get('domain')}>
                <Event
                  latest={log.get('latest')}
                  owner={log.get('owner')}
                  domain={log.get('domain')}
                  whitelisted={log.getIn(['latest', 'whitelisted'])}

                  handleClickCommitVote={this.handleCommitVote}
                  handleClickUpdateStatus={this.handleUpdateStatus}
                  handleClickTest={this.handleTest}
                />
              </Section>
            ))}
        </FlexContainer>

        <H2>{'Registry ('}{registryListings.size}{')'}</H2>
        <FlexContainer>
          {registryListings.size > 0 &&
            registryListings.map(log => (
              <Section key={log.get('domain')}>
                <Event
                  latest={log.get('latest')}
                  owner={log.get('owner')}
                  domain={log.get('domain')}
                  whitelisted={log.getIn(['latest', 'whitelisted'])}

                  handleClickChallenge={this.handleChallenge}
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
  wallet: selectWallet,
  account: selectAccount,
  candidates: selectCandidates,
  faceoffs: selectFaceoffs,
  registryListings: selectWhitelist,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(App)
