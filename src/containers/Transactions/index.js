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
} from 'modules/home/selectors'
import { selectMiningStatus, selectLatestTxn } from 'modules/transactions/selectors'
import { selectSidePanelListing, selectSidePanelMethod } from 'modules/listings/selectors'
import * as liActions from 'modules/listings/actions'
import * as txActions from 'modules/transactions/actions'

import { convertedToBaseUnit, BN, baseToConvertedUnit } from 'libs/units'

import toJS from 'components/toJS'
import Apply from 'containers/Transactions/Apply'
import Transfer from 'containers/Transactions/Transfer'
import NoBalance from 'containers/Transactions/NoBalance'
import Challenge from 'containers/Transactions/Challenge'
import CommitVote from 'containers/Transactions/CommitVote'
import RevealVote from 'containers/Transactions/RevealVote'
import UpdateStatus from 'containers/Transactions/UpdateStatus'
import ClaimReward from 'containers/Transactions/ClaimReward'
export const TransactionsContext = React.createContext()

class Transactions extends Component {
  state = {
    listingID: '',
    data: '',
    numTokens: '',
    transferTo: '',
    fileInput: false,
    visibleApprove: true,
    depositMore: false,
  }
  closeSidePanel = () => {
    this.props.onOpenSidePanel({}, '')
  }
  showApprove = () => {
    this.setState({ visibleApprove: true })
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
      tcr,
      account,
      voting,
      registry,
      balances,
      parameters,
      sidePanelListing,
      sidePanelMethod,
    } = this.props

    const needToApproveRegistry = BN(balances.registryAllowance).lt(
      BN(baseToConvertedUnit(parameters.minDeposit, tcr.tokenDecimals))
    )
    const needToApproveVoting = balances.votingAllowance === '0.0'

    return (
      <TransactionsContext.Provider
        value={{
          handleApply: this.handleApply,
          handleApprove: this.handleApprove,
          handleTransfer: this.handleTransfer,
          handleChallenge: this.handleChallenge,
          handleCommitVote: this.handleCommitVote,
          handleRevealVote: this.handleRevealVote,
          handleClaimReward: this.handleClaimReward,
          handleUpdateStatus: this.handleUpdateStatus,
          showApprove: this.showApprove,
          closeSidePanel: this.closeSidePanel,
          handleFileInput: this.handleFileInput,
          handleInputChange: this.handleInputChange,
          opened: sidePanelMethod,
          selectedOne: sidePanelListing,
          needToApproveRegistry,
          needToApproveVoting,
          ...this.props,
        }}
      >
        <Transfer />
        <Apply visibleApprove={this.state.visibleApprove} />
        <Challenge />
        {sidePanelMethod === 'commitVote' && (
          <CommitVote numTokens={this.state.numTokens} />
        )}
        {sidePanelMethod === 'revealVote' && <RevealVote />}
        {sidePanelMethod === 'claimReward' && (
          <ClaimReward
            selectedOne={this.props.sidePanelListing}
            account={account}
            voting={voting}
            registry={registry}
          />
        )}
        <UpdateStatus />
      </TransactionsContext.Provider>
    )
  }

  // personal message signature recovery
  handlePersonalSign = () => {
    this.props.onSendTransaction({ methodName: 'personalSign', args: [] })
  }
  // TRANSACTIONS
  handleApprove = contract => {
    const { parameters, tcr } = this.props
    let numTokens
    if (this.state.numTokens === '') {
      numTokens = convertedToBaseUnit(parameters.minDeposit, tcr.tokenDecimals)
    } else {
      numTokens = convertedToBaseUnit(this.state.numTokens, tcr.tokenDecimals)
    }
    const args = [this.props[contract].address, numTokens]
    this.props.onSendTransaction({ methodName: 'approve', args })
  }
  handleTransfer = () => {
    const { parameters, tcr } = this.props
    let numTokens
    if (this.state.numTokens === '') {
      numTokens = convertedToBaseUnit(parameters.minDeposit, tcr.tokenDecimals)
    } else {
      numTokens = convertedToBaseUnit(this.state.numTokens, tcr.tokenDecimals)
    }

    const args = [this.state.transferTo, numTokens]
    this.props.onSendTransaction({ methodName: 'transfer', args })
  }
  handleApply = () => {
    const { parameters, tcr } = this.props
    const numTokens = convertedToBaseUnit(parameters.minDeposit, tcr.tokenDecimals)
    const args = [this.state.listingID, numTokens, this.state.data]
    this.props.onSendTransaction({ methodName: 'apply', args })
  }
  handleChallenge = () => {
    const args = [this.props.sidePanelListing.listingHash, this.state.data]
    this.props.onSendTransaction({ methodName: 'challenge', args })
  }
  handleRequestVotingRights = () => {
    const args = [this.state.numTokens]
    this.props.onSendTransaction({ methodName: 'requestVotingRights', args })
  }
  handleCommitVote = (voteOption, salt) => {
    const args = [
      this.props.sidePanelListing.challengeID,
      voteOption,
      this.state.numTokens,
      salt,
    ]
    this.props.onSendTransaction({
      methodName: 'commitVote',
      args,
    })
  }
  handleRevealVote = (pollID, voteOption, salt) => {
    const args = [pollID, voteOption, salt]
    this.props.onSendTransaction({ methodName: 'revealVote', args })
  }
  handleUpdateStatus = listingHash => {
    const args = [listingHash]
    this.props.onSendTransaction({ methodName: 'updateStatus', args })
  }
  handleRescueTokens = listing => {
    const args = [listing.challengeID]
    this.props.onSendTransaction({ methodName: 'rescueTokens', args })
  }
  handleClaimReward = () => {
    const args = [this.props.sidePanelListing.challengeID, this.state.fileInput.salt]
    this.props.onSendTransaction({ methodName: 'claimReward', args })
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
export default compose(withConnect)(toJS(Transactions))

// <NoBalance
//   opened={sidePanelMethod !== ''}
//   closeSidePanel={this.closeSidePanel}
//   handleInputChange={this.handleInputChange}
//   {...this.props}
// />
