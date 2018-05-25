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
