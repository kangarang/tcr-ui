import React from 'react'

import translate from 'translations'
import { colors } from 'global-styles'

import { MarginDiv } from 'components/StyledHome'
import Button from 'components/Button'
import Text from 'components/Text'

import { SideText, SideTextInput } from './components'
import SidePanelSeparator from './components/SidePanelSeparator'
import TotalAmount from './components/TotalAmount'
import SidePanel from './components/SidePanel'
import { TransactionsContext } from './index'

export default ({ visibleApprove }) => (
  <div>
    <TransactionsContext.Consumer>
      {({
        handleInputChange,
        closeSidePanel,
        handleApprove,
        needToApproveRegistry,
        handleApply,
        showApprove,
        parameters,
        balances,
        opened,
        tcr,
      }) => (
        <SidePanel
          title="Start an Application"
          opened={opened === 'apply'}
          onClose={closeSidePanel}
        >
          <SidePanelSeparator />

          {needToApproveRegistry ? (
            <SideText small color="grey" text={translate('ins_approve_registry')} />
          ) : (
            <div>
              <SideTextInput
                title="Listing Name"
                type="text"
                handleInputChange={e => handleInputChange(e, 'listingID')}
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
              handleInputChange={e => handleInputChange(e, 'data')}
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
                  handleInputChange={e => handleInputChange(e, 'numTokens')}
                />
                <Button
                  methodName="approve"
                  onClick={e => handleApprove('registry')}
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
                onClick={handleApply}
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
  </div>
)
