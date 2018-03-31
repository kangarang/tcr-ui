import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import { setupEthereum, sendTransaction, chooseTCR } from '../../actions'

import {
  selectError,
  selectBalances,
  selectWhitelist,
  selectCandidates,
  selectFaceoffs,
  selectAllContracts,
  selectRegistry,
  selectToken,
  selectParameters,
  selectMiningStatus,
  selectLatestTxn,
} from 'selectors'

import { convertedToBaseUnit } from 'utils/_units'

import Apply from 'containers/Transaction/Apply'
import Challenge from 'containers/Transaction/Challenge'
import CommitVote from 'containers/Transaction/CommitVote'
import RevealVote from 'containers/Transaction/RevealVote'

import AppBar from 'components/AppBar'

import Stats from '../Stats'
import Tabs from '../Tabs'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeItem: 0,
      opened: false,
      listingName: '',
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
    const {
      candidates,
      faceoffs,
      whitelist,
      registry,
      balances,
      parameters,
      token,
      contracts,
      miningStatus,
      latestTxn,
    } = this.props

    return (
      <div>
        {/* apply, title, navigation */}
        <AppBar {...this.props} openSidePanel={e => this.openSidePanel(null, 'apply')} />

        {/* center general stats */}
        <Stats {...this.props} />

        {/* filtered listings */}
        <Tabs
          registry={registry}
          candidates={candidates}
          faceoffs={faceoffs}
          whitelist={whitelist}
          openSidePanel={this.openSidePanel}
          chooseTCR={this.chooseTCR}
          handleUpdateStatus={this.handleUpdateStatus}
        />

        {/* transaction modules */}
        <Apply
          opened={this.state.opened === 'apply'}
          closeSidePanel={this.closeSidePanel}
          token={token}
          contracts={contracts}
          parameters={parameters}
          balances={balances}
          handleInputChange={this.handleInputChange}
          handleApprove={this.handleApprove}
          handleApply={this.handleApply}
          visibleApprove={this.state.visibleApprove}
          openApprove={this.openApprove}
          miningStatus={miningStatus}
          latestTxn={latestTxn}
        />

        <Challenge
          opened={this.state.opened === 'challenge'}
          closeSidePanel={this.closeSidePanel}
          token={token}
          contracts={contracts}
          parameters={parameters}
          balances={balances}
          handleInputChange={this.handleInputChange}
          handleApprove={this.handleApprove}
          handleChallenge={this.handleChallenge}
          selectedOne={this.state.selectedOne}
          miningStatus={miningStatus}
          latestTxn={latestTxn}
        />

        <CommitVote
          opened={this.state.opened === 'commitVote'}
          closeSidePanel={this.closeSidePanel}
          balances={balances}
          selectedOne={this.state.selectedOne}
          handleInputChange={this.handleInputChange}
          handleApprove={this.handleApprove}
          handleCommitVote={this.handleCommitVote}
          handleRequestVotingRights={this.handleRequestVotingRights}
          miningStatus={miningStatus}
          latestTxn={latestTxn}
        />

        <RevealVote
          opened={this.state.opened === 'revealVote'}
          closeSidePanel={this.closeSidePanel}
          parameters={parameters}
          balances={balances}
          selectedOne={this.state.selectedOne}
          handleFileInput={this.handleFileInput}
          handleApprove={this.handleApprove}
          handleRevealVote={this.handleRevealVote}
          miningStatus={miningStatus}
          latestTxn={latestTxn}
        />
      </div>
    )
  }

  // TRANSACTIONS
  handleApprove = contract => {
    const args = [this.props[contract].address, convertedToBaseUnit(this.state.numTokens, 18)]
    this.props.onSendTransaction({ methodName: 'approve', args })
  }
  handleApply = () => {
    const { _Application } = this.props.registry.interface.events
    console.log('_Application', _Application)

    const args = [
      this.state.listingName,
      convertedToBaseUnit(this.props.parameters.get('minDeposit'), 18),
      // convertedToBaseUnit(this.state.numTokens, 18),
      this.state.data,
    ]
    this.props.onSendTransaction({ methodName: 'apply', args })
  }
  handleChallenge = () => {
    const args = [this.state.selectedOne.get('listingHash'), this.state.selectedOne.get('ipfsData')]
    this.props.onSendTransaction({ methodName: 'challenge', args })
  }
  handleRequestVotingRights = () => {
    const args = [this.state.numTokens]
    this.props.onSendTransaction({ methodName: 'requestVotingRights', args })
  }
  handleCommitVote = voteOption => {
    const args = [
      this.state.selectedOne.getIn(['latest', 'pollID']),
      voteOption,
      this.state.numTokens,
      this.state.selectedOne.get('ipfsID'),
    ]
    this.props.onSendTransaction({ methodName: 'commitVote', args })
  }
  handleRevealVote = () => {
    const args = [
      this.state.selectedOne.getIn(['latest', 'pollID']),
      this.state.fileInput.voteOption,
      this.state.fileInput.salt,
    ]
    this.props.onSendTransaction({ methodName: 'revealVote', args })
  }
  handleUpdateStatus = listing => {
    const args = [listing.get('listingHash')]
    this.props.onSendTransaction({ methodName: 'updateStatus', args })
  }
  handleRescueTokens = listing => {
    const args = [listing.getIn(['latest', 'pollID'])]
    this.props.onSendTransaction({ methodName: 'rescueTokens', args })
  }
  handleClaimVoterReward = () => {
    const args = [this.state.selectedOne.getIn(['latest', 'pollID']), this.state.fileInput.salt]
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

  balances: selectBalances,
  miningStatus: selectMiningStatus,
  latestTxn: selectLatestTxn,

  contracts: selectAllContracts,
  registry: selectRegistry,
  token: selectToken,

  parameters: selectParameters,

  candidates: selectCandidates,
  faceoffs: selectFaceoffs,
  whitelist: selectWhitelist,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(Home)
