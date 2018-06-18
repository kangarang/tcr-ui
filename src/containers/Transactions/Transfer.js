import React from 'react'

import { colors } from 'global-styles'

import { MarginDiv } from 'components/StyledHome'
import Button from 'components/Button'

import { SideText, SideTextInput } from './components'
import SidePanelSeparator from './components/SidePanelSeparator'
import SidePanel from './components/SidePanel'

export default ({
  opened,
  closeSidePanel,
  tcr,
  balances,
  handleInputChange,
  handleTransfer,
}) => (
  <div>
    <SidePanel title="Transfer Tokens" opened={opened} onClose={closeSidePanel}>
      <SidePanelSeparator />

      <SideText small color="grey" text={'Number of tokens to transfer'} />
      <SideTextInput
        title="Address"
        type="string"
        handleInputChange={e => handleInputChange(e, 'transferTo')}
      />
      <SideTextInput
        title="Number tokens"
        type="number"
        handleInputChange={e => handleInputChange(e, 'numTokens')}
      />

      <SidePanelSeparator />

      <MarginDiv>
        <Button
          methodName="transfer"
          bgColor={colors.brightBlue}
          onClick={handleTransfer}
          wide
          color={'white'}
          mode="strong"
        >
          {'Transfer Tokens'}
        </Button>
      </MarginDiv>
    </SidePanel>
  </div>
)
