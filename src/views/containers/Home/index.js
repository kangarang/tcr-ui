import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import Notifications from 'react-notification-system-redux'

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
  selectStats,
  selectNotifications,
} from 'redux/modules/home/selectors'
import { selectMiningStatus, selectLatestTxn } from 'redux/modules/transactions/selectors'
import * as actions from 'redux/modules/home/actions'
import * as txActions from 'redux/modules/transactions/actions'
import * as epActions from 'redux/modules/ethProvider/actions'

import { convertedToBaseUnit, BN, baseToConvertedUnit } from 'redux/libs/units'

import Apply from 'views/containers/Transaction/Apply'
import Challenge from 'views/containers/Transaction/Challenge'
import CommitVote from 'views/containers/Transaction/CommitVote'
import RevealVote from 'views/containers/Transaction/RevealVote'

import Header from 'views/components/Header'
import Stats from 'views/components/Stats'
import Listings from '../Listings/Loadable'
import styled from 'styled-components'

const notificationStyles = {
  NotificationItem: {
    DefaultStyle: {
      margin: '10px 5px 2px 5px',
      width: '400px',
    },
    info: {
      // color: 'black',
      // backgroundColor: 'white',
    },
  },
}

const HomeWrapper = styled.div`
  width: 100vw;
`
class Home extends Component {
  state = {
    opened: false,
    listingID: '',
    data: '',
    numTokens: '',
    selectedOne: false,
    fileInput: false,
    methodName: false,
    visibleApprove: true,
    expand: '',
    visibleRequestVotingRights: false,
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
    this.setState({ visibleApprove: true, visibleRequestVotingRights: true })
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
    const {
      error,
      balances,
      tcr,
      parameters,
      notifications,
      account,
      network,
      stats,
    } = this.props
    const needToApproveRegistry = BN(balances.get('registryAllowance')).lt(
      BN(baseToConvertedUnit(parameters.get('minDeposit'), tcr.get('tokenDecimals')))
    )
    const needToApproveVoting = BN(balances.get('votingAllowance')).lt(
      BN(baseToConvertedUnit(parameters.get('minDeposit'), tcr.get('tokenDecimals')))
    )

    return (
      <HomeWrapper>
        <Header
          error={error}
          openSidePanel={e => this.openSidePanel(null, 'apply')}
          network={network}
          account={account}
          tcr={tcr}
        />

        <Stats
          error={error}
          balances={balances}
          network={network}
          account={account}
          stats={stats}
          tcr={tcr}
        />

        <Listings
          openSidePanel={this.openSidePanel}
          chooseTCR={this.chooseTCR}
          handleUpdateStatus={this.handleUpdateStatus}
          {...this.props}
        />

        {this.state.opened === 'apply' && (
          <Apply
            opened={this.state.opened === 'apply'}
            closeSidePanel={this.closeSidePanel}
            handleInputChange={this.handleInputChange}
            handleApprove={this.handleApprove}
            handleApply={this.handleApply}
            visibleApprove={this.state.visibleApprove}
            showApprove={this.showApprove}
            needToApprove={needToApproveRegistry}
            {...this.props}
          />
        )}
        {this.state.opened === 'challenge' && (
          <Challenge
            opened={this.state.opened === 'challenge'}
            closeSidePanel={this.closeSidePanel}
            handleInputChange={this.handleInputChange}
            handleApprove={this.handleApprove}
            handleChallenge={this.handleChallenge}
            selectedOne={this.state.selectedOne}
            needToApprove={needToApproveRegistry}
            {...this.props}
          />
        )}
        {this.state.opened === 'commitVote' && (
          <CommitVote
            opened={this.state.opened === 'commitVote'}
            closeSidePanel={this.closeSidePanel}
            selectedOne={this.state.selectedOne}
            handleInputChange={this.handleInputChange}
            handleApprove={this.handleApprove}
            handleCommitVote={this.handleCommitVote}
            handleRequestVotingRights={this.handleRequestVotingRights}
            needToApprove={needToApproveVoting}
            visibleRequestVotingRights={this.state.visibleRequestVotingRights}
            showApprove={this.showApprove}
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

        <Notifications style={notificationStyles} notifications={notifications} />
      </HomeWrapper>
    )
  }

  // TRANSACTIONS
  handleApprove = contract => {
    const { tcr } = this.props
    const args = [
      this.props[contract].address,
      convertedToBaseUnit(this.state.numTokens, tcr.get('tokenDecimals')),
    ]
    this.props.onSendTransaction({ methodName: 'approve', args })
  }
  handleApply = () => {
    const { parameters, tcr } = this.props
    let numTokens
    if (this.state.numTokens === '') {
      numTokens = convertedToBaseUnit(
        parameters.get('minDeposit'),
        tcr.get('tokenDecimals')
      )
    } else {
      numTokens = convertedToBaseUnit(this.state.numTokens, tcr.get('tokenDecimals'))
    }

    const args = [this.state.listingID, numTokens, this.state.data]
    this.props.onSendTransaction({ methodName: 'apply', args })
  }
  handleChallenge = () => {
    const args = [this.state.selectedOne.get('listingHash'), this.state.data]
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
  abis: selectABIs,
  tcr: selectTCR,
  registry: selectRegistry,
  voting: selectVoting,
  parameters: selectParameters,
  stats: selectStats,

  miningStatus: selectMiningStatus,
  latestTxn: selectLatestTxn,
  notifications: selectNotifications,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)
export default compose(withConnect)(Home)
