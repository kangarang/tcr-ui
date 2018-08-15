import React from 'react'

import ApplyForm from './components/ApplyForm'
import SidePanel from './components/SidePanel'
import SidePanelSeparator from './components/SidePanelSeparator'

import { TransactionsContext } from './index'

export default class ApplyReduxForm extends React.Component {
  state = {
    listingID: '',
    data: '',
    numTokens: '',
  }

  handleChangeListingID = e => this.setState({ listingID: e.target.value })
  handleChangeNumTokens = e => this.setState({ numTokens: e.target.value })
  handleChangeData = e => this.setState({ data: e.target.value })

  render() {
    return (
      <TransactionsContext.Consumer>
        {({
          closeTxPanel,
          needToApproveRegistry,
          visibleApprove,
          showApprove,
          parameters,
          balances,
          opened,
          onSendTx,
          tcr,
        }) => (
          <SidePanel
            title="Start an Application"
            opened={opened === 'apply'}
            onClose={closeTxPanel}
          >
            <SidePanelSeparator />

            <ApplyForm
              handleCustomSubmit={e => {
                e.preventDefault()
                onSendTx('apply', this.state)
              }}
            />

            {/* <MarginDiv>
              {needToApproveRegistry ? (
                <div>
                  <SideTextInput
                    title="token amount"
                    type="number"
                    handleInputChange={this.handleChangeNumTokens}
                    value={this.state.numTokens}
                  />
                  <Button
                    methodName="approve"
                    onClick={() => onSendTx('approveRegistry', this.state)}
                    mode="strong"
                  >
                    {'Approve tokens for Registry'}
                  </Button>
                </div>
              ) : (
                <Button
                  methodName="apply"
                  bgColor={colors.brightBlue}
                  wide
                  color={'white'}
                  onClick={() => onSendTx('apply', this.state)}
                >
                  {'SUBMIT APPLICATION'}
                </Button>
              )}
            </MarginDiv> */}
          </SidePanel>
        )}
      </TransactionsContext.Consumer>
    )
  }
}
