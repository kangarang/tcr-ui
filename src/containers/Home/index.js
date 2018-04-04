import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import { setupEthereum, sendTransaction, chooseTCR } from '../../actions'

import {
  selectError,
  selectAccount,
  selectBalances,
  selectRegistry,
  selectToken,
  selectVoting,
  selectParameters,
  selectMiningStatus,
  selectLatestTxn,
} from 'selectors/index'
import { selectWhitelist, selectCandidates, selectFaceoffs } from 'selectors/listings'

import { convertedToBaseUnit } from 'libs/units'

import Apply from 'containers/Transaction/Apply'
import Challenge from 'containers/Transaction/Challenge'
import CommitVote from 'containers/Transaction/CommitVote'
import RevealVote from 'containers/Transaction/RevealVote'

import AppBar from 'components/AppBar'

import Stats from '../Stats'
import Tabs from '../Tabs'
import { selectTCR } from '../../selectors'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeItem: 0,
      opened: false,
      listingID: '',
      data: '',
      numTokens: '',
      selectedOne: false,
      fileInput: false,
      methodName: false,
      visibleApprove: false,
      voterReward: '0',
      expand: '',
    }
  }
  componentDidMount() {
    this.props.onSetupEthereum()
  }
  closeSidePanel = () => {
    this.setState({
      opened: false,
    })
  }
  openApprove = () => {
    this.setState({ visibleApprove: true })
  }
  chooseTCR = one => {
    this.props.onChooseTCR(one)
  }
  openSidePanel = (one, openThis) => {
    this.setState({
      selectedOne: one,
      opened: openThis,
    })
  }

  getVoterReward = async (pollID, salt) => {
    let vR
    try {
      vR = await this.props.registry.voterReward.call(this.props.account, pollID, salt)
    } catch (err) {
      vR = 'No reward :('
    }
    this.setState({
      voterReward: vR.toString(10),
    })
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

      this.getVoterReward(json.pollID, json.salt)
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
          openApprove={this.openApprove}
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
    const args = [this.props[contract].address, convertedToBaseUnit(this.state.numTokens, 18)]
    this.props.onSendTransaction({ methodName: 'approve', args })
  }
  handleApply = () => {
    let numTokens
    if (this.state.numTokens === '') {
      numTokens = convertedToBaseUnit(this.props.parameters.minDeposit, 18)
    } else {
      numTokens = convertedToBaseUnit(this.state.numTokens, 18)
    }

    const args = [this.state.listingID, numTokens, this.state.data]
    this.props.onSendTransaction({ methodName: 'apply', args })
  }
  handleChallenge = () => {
    const args = [this.state.selectedOne.listingHash, this.state.selectedOne.listingID]
    this.props.onSendTransaction({ methodName: 'challenge', args })
  }
  handleRequestVotingRights = () => {
    const args = [this.state.numTokens]
    this.props.onSendTransaction({ methodName: 'requestVotingRights', args })
  }
  handleCommitVote = voteOption => {
    const args = [
      this.state.selectedOne.challengeID,
      voteOption,
      this.state.numTokens,
      this.state.selectedOne.listingID,
    ]
    this.props.onSendTransaction({ methodName: 'commitVote', args })
  }
  handleRevealVote = () => {
    const args = [
      this.state.selectedOne.challengeID,
      this.state.fileInput.voteOption,
      this.state.fileInput.salt,
    ]
    this.props.onSendTransaction({ methodName: 'revealVote', args })
  }
  handleUpdateStatus = listing => {
    const args = [listing.listingHash]
    this.props.onSendTransaction({ methodName: 'updateStatus', args })
  }
  handleRescueTokens = listing => {
    const args = [listing.challengeID]
    this.props.onSendTransaction({ methodName: 'rescueTokens', args })
  }
  handleClaimVoterReward = () => {
    const args = [this.state.selectedOne.challengeID, this.state.fileInput.salt]
    this.props.onSendTransaction({ methodName: 'claimVoterReward', args })
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSetupEthereum: network => dispatch(setupEthereum(network)),
    onChooseTCR: tcr => dispatch(chooseTCR(tcr)),
    onSendTransaction: payload => dispatch(sendTransaction(payload)),
  }
}

const mapStateToProps = createStructuredSelector({
  error: selectError,

  account: selectAccount,

  balances: selectBalances,
  miningStatus: selectMiningStatus,
  latestTxn: selectLatestTxn,
  tcr: selectTCR,

  registry: selectRegistry,
  voting: selectVoting,
  token: selectToken,

  parameters: selectParameters,

  candidates: selectCandidates,
  faceoffs: selectFaceoffs,
  whitelist: selectWhitelist,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(Home)
