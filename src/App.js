import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'

import UDappHOC from './HOC/UDapp'

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
  applyListing,
  commitVote,
  checkTest,
  challengeListing,
  updateStatus,
} from './actions'

import {
  selectParameters,
  selectWallet,
  selectCandidates,
  selectFaceoffs,
  selectWhitelist,
  selectAccount,
} from './selectors'

class App extends Component {
  constructor() {
    super()
    this.state = {
      listing: '',
    }
  }

  componentDidMount() {
    console.log('App props:', this.props)
    this.props.onSetupEthereum()
  }

  handleApprove = e => {
    e.preventDefault()
    const deposit = '420'
    this.props.onApprove(deposit)
  }

  handleApply = e => {
    e.preventDefault()
    this.props.onApply(this.state.listing, '11')
  }

  handleChallenge = (e, listing) => {
    e.preventDefault()
    this.props.onChallenge(listing)
  }

  handleUpdateStatus = (e, listing) => {
    e.preventDefault()
    this.props.onUpdateStatus(listing)
  }

  handleCommitVote = (e, listing, pollID) => {
    e.preventDefault()
    this.props.onCommitVote(listing, pollID, this.props.amount)
  }

  handleTest = (e, listing) => {
    e.preventDefault()
    this.props.onTest(listing)
  }

  handleChange = (e) => {
    this.setState({
      listing: e.target.value
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
      whitelist,
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
          placeholder={'Listing'}
          value={this.state.listing}
          onChange={this.handleChange}
          onSubmit={this.handleApply}
        />

        <H2>{'Applicants ('}{candidates.size}{')'}</H2>
        <FlexContainer>
          {candidates.size > 0 &&
            candidates.map(log => (
              <Section key={log.get('listing')}>
                <Event
                  latest={log.get('latest')}
                  owner={log.get('owner')}
                  listing={log.get('listing')}
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
              <Section key={log.get('listing')}>
                <Event
                  latest={log.get('latest')}
                  owner={log.get('owner')}
                  listing={log.get('listing')}
                  whitelisted={log.getIn(['latest', 'whitelisted'])}

                  handleClickCommitVote={this.handleCommitVote}
                  handleClickUpdateStatus={this.handleUpdateStatus}
                  handleClickTest={this.handleTest}
                />
              </Section>
            ))}
        </FlexContainer>

        <H2>{'Registry ('}{whitelist.size}{')'}</H2>
        <FlexContainer>
          {whitelist.size > 0 &&
            whitelist.map(log => (
              <Section key={log.get('listing')}>
                <Event
                  latest={log.get('latest')}
                  owner={log.get('owner')}
                  listing={log.get('listing')}
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
    onApply: (listing, deposit) => dispatch(applyListing(listing, deposit)),
    onChallenge: listing => dispatch(challengeListing(listing)),
    onCommitVote: (listing, pollID, amount) => dispatch(commitVote(listing, pollID, amount)),
    onUpdateStatus: listing => dispatch(updateStatus(listing)),
  }
}

const mapStateToProps = createStructuredSelector({
  parameters: selectParameters,
  wallet: selectWallet,
  account: selectAccount,
  candidates: selectCandidates,
  faceoffs: selectFaceoffs,
  whitelist: selectWhitelist,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(UDappHOC(App))
