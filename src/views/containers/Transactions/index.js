import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'

import {
  selectAccount,
  selectBalances,
  selectTCR,
  selectRegistry,
  selectVoting,
  selectParameters,
} from 'redux/modules/home/selectors'
import { selectMiningStatus, selectLatestTxn } from 'redux/modules/transactions/selectors'
import {
  selectSidePanelListing,
  selectSidePanelMethod,
} from 'redux/modules/listings/selectors'
import * as liActions from 'redux/modules/listings/actions'
import * as txActions from 'redux/modules/transactions/actions'

import { convertedToBaseUnit, BN, baseToConvertedUnit } from 'redux/libs/units'

import Apply from 'views/containers/Transactions/Apply'
import Challenge from 'views/containers/Transactions/Challenge'
import CommitVote from 'views/containers/Transactions/CommitVote'
import RevealVote from 'views/containers/Transactions/RevealVote'
import UpdateStatus from 'views/containers/Transactions/UpdateStatus'
import ClaimVoterReward from 'views/containers/Transactions/ClaimVoterReward'

import styled from 'styled-components'

const TransactionsWrapper = styled.div`
  width: 100vw;
`
class Transactions extends Component {
  state = {
    listingID: '',
    data: '',
    numTokens: '',
    fileInput: false,
    visibleApprove: true,
    visibleRequestVotingRights: false,
    depositMore: false,
  }
  closeSidePanel = () => {
    this.props.onOpenSidePanel({}, '')
  }
  showApprove = () => {
    this.setState({ visibleApprove: true, visibleRequestVotingRights: true })
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
      balances,
      account,
      tcr,
      parameters,
      sidePanelListing,
      sidePanelMethod,
      children,
      voting,
    } = this.props

    const needToApproveRegistry = BN(balances.get('registryAllowance')).lt(
      BN(baseToConvertedUnit(parameters.get('minDeposit'), tcr.get('tokenDecimals')))
    )
    const needToApproveVoting = BN(balances.get('votingAllowance')).lt(
      BN(baseToConvertedUnit(parameters.get('minDeposit'), tcr.get('tokenDecimals')))
    )

    return (
      <TransactionsWrapper>
        {children}

        <Apply
          opened={sidePanelMethod === 'apply'}
          needToApprove={needToApproveRegistry}
          depositMore={this.state.depositMore}
          visibleApprove={this.state.visibleApprove}
          closeSidePanel={this.closeSidePanel}
          handleInputChange={this.handleInputChange}
          handleApprove={this.handleApprove}
          handleApply={this.handleApply}
          showApprove={this.showApprove}
          {...this.props}
        />
        <Challenge
          opened={sidePanelMethod === 'challenge'}
          closeSidePanel={this.closeSidePanel}
          tcr={tcr}
          parameters={parameters}
          selectedOne={sidePanelListing}
          needToApprove={needToApproveRegistry}
          handleInputChange={this.handleInputChange}
          handleApprove={this.handleApprove}
          handleChallenge={this.handleChallenge}
        />
        {sidePanelMethod === 'commitVote' && (
          <CommitVote
            selectedOne={sidePanelListing}
            opened={sidePanelMethod === 'commitVote'}
            needToApprove={needToApproveVoting}
            visibleRequestVotingRights={this.state.visibleRequestVotingRights}
            closeSidePanel={this.closeSidePanel}
            handleInputChange={this.handleInputChange}
            handleApprove={this.handleApprove}
            handleCommitVote={this.handleCommitVote}
            handleRequestVotingRights={this.handleRequestVotingRights}
            showApprove={this.showApprove}
            balances={balances}
            voting={voting}
            tcr={tcr}
            account={account}
            numTokens={this.state.numTokens}
          />
        )}
        {sidePanelMethod === 'revealVote' && (
          <RevealVote
            selectedOne={sidePanelListing}
            opened={sidePanelMethod === 'revealVote'}
            balances={balances}
            closeSidePanel={this.closeSidePanel}
            handleFileInput={this.handleFileInput}
            handleRevealVote={this.handleRevealVote}
          />
        )}
        <ClaimVoterReward
          selectedOne={sidePanelListing}
          opened={sidePanelMethod === 'claimVoterReward'}
          closeSidePanel={this.closeSidePanel}
          handleFileInput={this.handleFileInput}
          handleClaimVoterReward={this.handleClaimVoterReward}
        />
        <UpdateStatus
          selectedOne={sidePanelListing}
          opened={sidePanelMethod === 'updateStatus'}
          closeSidePanel={this.closeSidePanel}
          handleFileInput={this.handleFileInput}
          handleUpdateStatus={this.handleUpdateStatus}
        />
      </TransactionsWrapper>
    )
  }

  // TRANSACTIONS
  handleApprove = contract => {
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
    const args = [this.props[contract].address, numTokens]
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
    const args = [this.props.sidePanelListing.get('listingHash'), this.state.data]
    this.props.onSendTransaction({ methodName: 'challenge', args })
  }
  handleRequestVotingRights = () => {
    const args = [this.state.numTokens]
    this.props.onSendTransaction({ methodName: 'requestVotingRights', args })
  }
  handleCommitVote = (voteOption, salt) => {
    const args = [
      this.props.sidePanelListing.get('challengeID'),
      voteOption,
      this.state.numTokens,
      salt,
    ]
    this.props.onSendTransaction({
      methodName: 'commitVote',
      args,
    })
  }
  handleRevealVote = () => {
    const args = [
      this.props.sidePanelListing.get('challengeID'),
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
    const args = [
      this.props.sidePanelListing.get('challengeID'),
      this.state.fileInput.salt,
    ]
    this.props.onSendTransaction({ methodName: 'claimVoterReward', args })
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSendTransaction: payload => dispatch(txActions.sendTransactionStart(payload)),
    onOpenSidePanel: (selectedOne, methodName) =>
      dispatch(liActions.openSidePanel(selectedOne, methodName)),
  }
}

const mapStateToProps = createStructuredSelector({
  account: selectAccount,
  balances: selectBalances,
  tcr: selectTCR,
  registry: selectRegistry,
  voting: selectVoting,
  parameters: selectParameters,

  miningStatus: selectMiningStatus,
  latestTxn: selectLatestTxn,

  sidePanelListing: selectSidePanelListing,
  sidePanelMethod: selectSidePanelMethod,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)
export default compose(withConnect)(Transactions)
