import React from 'react'

import translate from 'translations'
import { colors } from 'global-styles'

import { MarginDiv } from 'components/StyledHome'
import Button from 'components/Button'
import Text from 'components/Text'

import SidePanelSeparator from './components/SidePanelSeparator'
import SideTextInput from './components/SideTextInput'
import TotalAmount from './components/TotalAmount'
import SidePanel from './components/SidePanel'
import SideText from './components/SideText'

import { TransactionsContext } from './index'

export default class Apply extends React.Component {
  state = {
    listingID: '',
    data: '',
    numTokens: '',
  }
  handleChangeListingID = e => this.setState({ listingID: e.target.value })
  handleChangeData = e => this.setState({ data: e.target.value })
  handleChangeNumTokens = e => this.setState({ numTokens: e.target.value })
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

            {needToApproveRegistry ? (
              <SideText small color="grey" text={translate('ins_approve_registry')} />
            ) : (
              <div>
                <SideTextInput
                  title="Listing Name"
                  type="text"
                  handleInputChange={this.handleChangeListingID}
                />

                <SideText small color="grey" text={translate('ins_apply')} />

                <TotalAmount
                  copy={'Minimum Deposit'}
                  minDeposit={parameters.minDeposit}
                  tokenSymbol={tcr.tokenSymbol}
                />
              </div>
            )}

            {/* TODO: hide this unless user wants to deposit more than the minDeposit */}
            {/* <SideTextInput
        title="token amount"
        type="number"
        handleInputChange={e => handleInputChange(e, 'numTokens')}
      /> */}

            {!needToApproveRegistry && (
              <SideTextInput
                title="img url"
                type="text"
                handleInputChange={this.handleChangeData}
              />
            )}

            <SidePanelSeparator />

            <SideText color="grey" text={translate('mm_apply')} />

            <MarginDiv>
              {needToApproveRegistry ? (
                <div>
                  <SideTextInput
                    title="token amount"
                    type="number"
                    handleInputChange={this.handleChangeNumTokens}
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
            </MarginDiv>

            <MarginDiv>
              {!visibleApprove ? (
                <Button onClick={showApprove} mode="">
                  {'Show approve'}
                </Button>
              ) : (
                <div>
                  {needToApproveRegistry && (
                    <Text
                      size="xlarge"
                      color="red"
                      children={`You must approve the Registry contract before you can submit an application. Your current allowance for the Registry is ${
                        balances.registryAllowance
                      }. The minimum deposit for application in the Registry is ${
                        parameters.minDeposit
                      } ${tcr.tokenSymbol}`}
                    />
                  )}
                </div>
              )}
            </MarginDiv>
          </SidePanel>
        )}
      </TransactionsContext.Consumer>
    )
  }
}
