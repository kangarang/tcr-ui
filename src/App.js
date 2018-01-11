import React, { Component } from 'react'
// import NetworkStatus from 'react-web3-network-status/stateless'

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
  selectAllListings,
} from './selectors'

class App extends Component {
  constructor() {
    super()
    this.state = {
      listing: '',
      deposit: '',
    }
  }

  componentDidMount() {
    this.props.onSetupEthereum()
  }

  checkProvider = () => {
    // this.intervalID = window.setInterval(
    //   () => this.props.onCheckProvider(),
    //   1000
    // )
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

  handleChangeDeposit = (e) => {
    console.log('e', e)
    this.setState({
      deposit: e.target.value
    })
  }

  handleChangeListing = (e) => {
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
      registryListings,
      parameters,
    } = this.props

    return (
      <div>

        {/* <div>
          <NetworkStatus
            networkId='420' // 1, 3, 4, 42, null, 'not-listening', or 'account-not-unlocked'
            address={account} // optional
          />
        </div> */}
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
          // id={this.state.listing}
          value={this.state.listing}
          onChange={this.handleChangeListing}
          depositValue={this.state.deposit}
          onChangeDeposit={this.handleChangeDeposit}
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

        <H2>{'Registry ('}{registryListings.size}{')'}</H2>
        <FlexContainer>
          {registryListings.size > 0 &&
            registryListings.map(log => (
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
    onTest: listing => dispatch(checkTest(listing)),
  }
}

const mapStateToProps = createStructuredSelector({
  parameters: selectParameters,
  wallet: selectWallet,
  account: selectAccount,
  candidates: selectCandidates,
  listings: selectAllListings,
  faceoffs: selectFaceoffs,
  registryListings: selectWhitelist,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(App)
