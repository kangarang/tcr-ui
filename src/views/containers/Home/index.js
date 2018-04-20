import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'

import {
  selectError,
  selectAccount,
  selectNetwork,
  selectBalances,
  selectABIs,
  selectTCR,
  selectRegistry,
  selectVoting,
  selectParameters,
  selectAllListings,
  selectFaceoffs,
  selectWhitelist,
  selectCandidates,
  onlyCandidateIDs,
  onlyFaceoffIDs,
  onlyWhitelistIDs,
  selectStats,
} from 'state/ducks/home/selectors'
import { selectMiningStatus, selectLatestTxn } from 'state/ducks/transactions/selectors'

import * as actions from 'state/ducks/home/actions'
import * as txActions from 'state/ducks/transactions/actions'
import * as epActions from 'state/ducks/ethProvider/actions'

import { convertedToBaseUnit } from 'state/libs/units'

import Stats from 'views/containers/Stats'
import Tabs from 'views/containers/Tabs'
import Apply from 'views/containers/Transaction/Apply'
import Challenge from 'views/containers/Transaction/Challenge'
import CommitVote from 'views/containers/Transaction/CommitVote'
import RevealVote from 'views/containers/Transaction/RevealVote'

import AppBar from 'views/components/AppBar'

class Home extends Component {
  state = {
    activeItem: 0,
    opened: false,
    listingID: '',
    data: '',
    numTokens: '',
    selectedOne: false,
    fileInput: false,
    methodName: false,
    visibleApprove: false,
    expand: '',
  }
  componentDidMount() {
    this.props.onSetupEthereum()
  }

  closeSidePanel = () => {
    this.setState({
      opened: false,
    })
  }

  showApprove = () => {
    this.setState({ visibleApprove: true })
  }

  openSidePanel = (one, openThis) => {
    this.setState({
      selectedOne: one,
      opened: openThis,
    })
  }

  chooseTCR = one => {
    this.props.onChooseTCR(one)
  }

  handleFileInput = e => {
    const file = e.target.files[0]
    const fr = new window.FileReader()

    fr.onload = () => {
      const contents = fr.result
      const json = JSON.parse(contents)

      try {
        this.setState({
          fileInput: json,
        })
      } catch (error) {
        throw new Error('Invalid Commit JSON file')
      }
      // this.getVoterReward(json.pollID, json.salt)
    }
    fr.readAsText(file)
  }

  handleInputChange = (e, t) => {
    this.setState({
      [t]: e.target.value,
    })
  }

  render() {
    return (
      <div>
        {/* apply, title, navigation */}
        <AppBar {...this.props} openSidePanel={e => this.openSidePanel(null, 'apply')} />

        {/* center general stats */}
        <Stats {...this.props} />

        {/* filtered listings */}
        <Tabs
          openSidePanel={this.openSidePanel}
          chooseTCR={this.chooseTCR}
          handleUpdateStatus={this.handleUpdateStatus}
          {...this.props}
        />

        {/* transaction modules */}
        <Apply
          opened={this.state.opened === 'apply'}
          closeSidePanel={this.closeSidePanel}
          handleInputChange={this.handleInputChange}
          handleApprove={this.handleApprove}
          handleApply={this.handleApply}
          visibleApprove={this.state.visibleApprove}
          showApprove={this.showApprove}
          {...this.props}
        />

        <Challenge
          opened={this.state.opened === 'challenge'}
          closeSidePanel={this.closeSidePanel}
          handleInputChange={this.handleInputChange}
          handleApprove={this.handleApprove}
          handleChallenge={this.handleChallenge}
          selectedOne={this.state.selectedOne}
          {...this.props}
        />

        {this.state.opened === 'commitVote' && (
          <CommitVote
            opened={this.state.opened === 'commitVote'}
            closeSidePanel={this.closeSidePanel}
            selectedOne={this.state.selectedOne}
            handleInputChange={this.handleInputChange}
            handleApprove={this.handleApprove}
            handleCommitVote={this.handleCommitVote}
            handleRequestVotingRights={this.handleRequestVotingRights}
            {...this.props}
          />
        )}

        {this.state.opened === 'revealVote' && (
          <RevealVote
            opened={this.state.opened === 'revealVote'}
            closeSidePanel={this.closeSidePanel}
            selectedOne={this.state.selectedOne}
            handleFileInput={this.handleFileInput}
            handleApprove={this.handleApprove}
            handleRevealVote={this.handleRevealVote}
            {...this.props}
          />
        )}
      </div>
    )
  }

  // TRANSACTIONS
  handleApprove = contract => {
    const { tcr } = this.props
    const args = [
      this.props[contract].address,
      convertedToBaseUnit(this.state.numTokens, tcr.tokenDecimals),
    ]
    this.props.onSendTransaction({ methodName: 'approve', args })
  }
  handleApply = () => {
    const { parameters, tcr } = this.props
    let numTokens
    if (this.state.numTokens === '') {
      numTokens = convertedToBaseUnit(parameters.get('minDeposit'), tcr.tokenDecimals)
    } else {
      numTokens = convertedToBaseUnit(this.state.numTokens, tcr.tokenDecimals)
    }

    const args = [this.state.listingID, numTokens, this.state.data]
    this.props.onSendTransaction({ methodName: 'apply', args })
  }
  handleChallenge = () => {
    const args = [
      this.state.selectedOne.get('listingHash'),
      this.state.selectedOne.get('listingID'),
    ]
    this.props.onSendTransaction({ methodName: 'challenge', args })
  }
  handleRequestVotingRights = () => {
    const args = [this.state.numTokens]
    this.props.onSendTransaction({ methodName: 'requestVotingRights', args })
  }
  handleCommitVote = voteOption => {
    const args = [
      this.state.selectedOne.get('challengeID'),
      voteOption,
      this.state.numTokens,
      this.state.selectedOne.get('listingID'),
    ]
    const commitEndDate = this.state.selectedOne.getIn(['commitExpiry', 'timestamp'])
    const revealEndDate = this.state.selectedOne.getIn(['revealExpiry', 'timestamp'])
    this.props.onSendTransaction({
      methodName: 'commitVote',
      args,
      commitEndDate,
      revealEndDate,
    })
  }
  handleRevealVote = () => {
    const args = [
      this.state.selectedOne.get('challengeID'),
      this.state.fileInput.voteOption,
      this.state.fileInput.salt,
    ]
    this.props.onSendTransaction({ methodName: 'revealVote', args })
  }
  handleUpdateStatus = listingHash => {
    const args = [listingHash]
    this.props.onSendTransaction({ methodName: 'updateStatus', args })
  }
  handleRescueTokens = listing => {
    const args = [listing.get('challengeID')]
    this.props.onSendTransaction({ methodName: 'rescueTokens', args })
  }
  handleClaimVoterReward = () => {
    const args = [this.state.selectedOne.get('challengeID'), this.state.fileInput.salt]
    this.props.onSendTransaction({ methodName: 'claimVoterReward', args })
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSetupEthereum: network => dispatch(actions.setupEthereumStart(network)),
    onChooseTCR: tcr => dispatch(epActions.chooseTCR(tcr)),
    onSendTransaction: payload => dispatch(txActions.sendTransactionStart(payload)),
  }
}

const mapStateToProps = createStructuredSelector({
  error: selectError,

  account: selectAccount,
  network: selectNetwork,

  balances: selectBalances,
  tcr: selectTCR,

  abis: selectABIs,
  registry: selectRegistry,
  voting: selectVoting,
  // token: selectToken,
  parameters: selectParameters,

  stats: selectStats,

  miningStatus: selectMiningStatus,
  latestTxn: selectLatestTxn,

  allListings: selectAllListings,
  candidates: selectCandidates,
  candidateIDs: onlyCandidateIDs,
  faceoffs: selectFaceoffs,
  faceoffIDs: onlyFaceoffIDs,
  whitelist: selectWhitelist,
  whitelistIDs: onlyWhitelistIDs,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)
export default compose(withConnect)(Home)
