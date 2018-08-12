import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'

import * as actions from 'modules/transactions/actions'
import { selectTxPanelListing, selectTxPanelMethod } from 'modules/transactions/selectors'
import { selectBalances, selectTCR, selectParameters } from 'modules/home/selectors'

import { BN, fromTokenBase } from 'libs/units'

import toJS from 'components/toJS'
import Apply from 'containers/Transactions/Apply'
import Transfer from 'containers/Transactions/Transfer'
import Challenge from 'containers/Transactions/Challenge'
import CommitVote from 'containers/Transactions/CommitVote'
import RevealVote from 'containers/Transactions/RevealVote'
import ClaimReward from 'containers/Transactions/ClaimReward'
import UpdateStatus from 'containers/Transactions/UpdateStatus'

export const TransactionsContext = React.createContext()

class TransactionsProvider extends Component {
  state = {
    fileInput: false,
  }
  closeTxPanel = () => {
    this.props.onOpenTxPanel({}, '')
  }
  handleSendTx = (methodName, txInput) => {
    this.props.onSendTransaction({ methodName, txInput })
  }

  render() {
    const {
      tcr,
      // children,
      balances,
      parameters,
      txPanelListing,
      txPanelMethod,
    } = this.props

    const needToApproveRegistry = BN(balances.registryAllowance).lt(
      BN(fromTokenBase(parameters.minDeposit, tcr.tokenDecimals))
    )
    const needToApproveVoting = balances.votingAllowance === '0.0'

    return (
      <TransactionsContext.Provider
        value={{
          // handleFileInput: this.handleFileInput,
          closeTxPanel: this.closeTxPanel,
          selectedOne: txPanelListing,
          onSendTx: this.handleSendTx,
          opened: txPanelMethod,
          needToApproveRegistry,
          needToApproveVoting,
          parameters,
          balances,
          tcr,
        }}
      >
        {/* {children} */}

        <Transfer />
        <Apply />
        <Challenge />

        {txPanelMethod === 'updateStatus' && <UpdateStatus />}
        {txPanelMethod === 'commitVote' && <CommitVote />}
        {txPanelMethod === 'revealVote' && <RevealVote selectedOne={txPanelListing} />}
        {txPanelMethod === 'claimReward' && <ClaimReward />}
      </TransactionsContext.Provider>
    )
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
    }
    fr.readAsText(file)
  }
}

const mapStateToProps = createStructuredSelector({
  tcr: selectTCR,
  balances: selectBalances,
  parameters: selectParameters,
  txPanelMethod: selectTxPanelMethod,
  txPanelListing: selectTxPanelListing,
})

const withConnect = connect(
  mapStateToProps,
  {
    onSendTransaction: actions.sendTransactionStart,
    onOpenTxPanel: actions.openTxPanel,
  }
)
export default compose(withConnect)(toJS(TransactionsProvider))
