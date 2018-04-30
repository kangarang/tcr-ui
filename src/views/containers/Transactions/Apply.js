import React from 'react'

import translate from 'views/translations'
import { colors } from 'views/global-styles'

import { MarginDiv } from 'views/components/StyledHome'
import Button from 'views/components/Button'
import Text from 'views/components/Text'

import { SideText, SideTextInput } from './components'
import SidePanelSeparator from './components/SidePanelSeparator'
import TotalAmount from './components/TotalAmount'
import SidePanel from './components/SidePanel'

export default ({
  opened,
  depositMore,
  closeSidePanel,
  tcr,
  parameters,
  balances,
  handleInputChange,
  handleApprove,
  handleApply,
  showApprove,
  needToApprove,
  visibleApprove,
}) => (
  <div>
    <SidePanel title="Start an Application" opened={opened} onClose={closeSidePanel}>
      <SidePanelSeparator />

      {needToApprove ? (
        <SideText small color="grey" text={translate('ins_approve_registry')} />
      ) : (
        <div>
          <SideTextInput
            title="token address"
            type="text"
            handleInputChange={e => handleInputChange(e, 'listingID')}
          />

          <SideText small color="grey" text={translate('ins_apply')} />

          <TotalAmount
            copy={'Minimum Deposit'}
            minDeposit={parameters.get('minDeposit')}
            tokenSymbol={tcr.get('tokenSymbol')}
          />
        </div>
      )}

      {/* TODO: hide this unless user wants to deposit more than the minDeposit */}
      {depositMore && (
        <SideTextInput
          title="token amount"
          type="number"
          handleInputChange={e => handleInputChange(e, 'numTokens')}
        />
      )}

      {!needToApprove && (
        <SideTextInput
          title="data"
          type="text"
          handleInputChange={e => handleInputChange(e, 'data')}
        />
      )}

      <SidePanelSeparator />

      <SideText color="grey" text={translate('mm_apply')} />

      <MarginDiv>
        {needToApprove ? (
          <Button
            methodName="approve"
            onClick={e => handleApprove('registry')}
            mode="strong"
          >
            {'Approve tokens for Registry'}
          </Button>
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
            {needToApprove && (
              <Text
                size="xlarge"
                color="red"
                children={`You must approve the Registry contract before you can submit an application. Your current allowance for the Registry is ${balances.get(
                  'registryAllowance'
                )}. The minimum deposit for application in the Registry is ${parameters.get(
                  'minDeposit'
                )} ${tcr.get('tokenSymbol')}`}
              />
            )}
          </div>
        )}
      </MarginDiv>
    </SidePanel>
  </div>
)
