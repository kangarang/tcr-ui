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

import TxnProgress from './TxnProgress'

export default ({
  opened,
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
      <SideTextInput
        title="token amount"
        type="number"
        handleInputChange={e => handleInputChange(e, 'numTokens')}
      />
      <SideTextInput
        title="data"
        type="text"
        handleInputChange={e => handleInputChange(e, 'data')}
      />

      <SidePanelSeparator />

      <SideText color="grey" text={translate('mm_apply')} />

      <MarginDiv>
        {needToApprove ? (
          <Button onClick={e => handleApprove('registry')} mode="strong">
            {'Approve tokens for Registry'}
          </Button>
        ) : (
          <Button
            bgColor={colors.brightBlue}
            wide
            fgColor={'white'}
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
              <Text size="xlarge" color="red" children={translate('must_approve')} />
            )}
          </div>
        )}
      </MarginDiv>
    </SidePanel>
  </div>
)
