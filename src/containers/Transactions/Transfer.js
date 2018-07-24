import React from 'react'

import { colors } from 'global-styles'

import { MarginDiv } from 'components/StyledHome'
import Button from 'components/Button'

import { SideText, SideTextInput } from './components'
import SidePanelSeparator from './components/SidePanelSeparator'
import SidePanel from './components/SidePanel'

import { TransactionsContext } from './index'

export default () => (
  <div>
    <TransactionsContext.Consumer>
      {({ closeSidePanel, handleInputChange, handleTransfer, opened }) => (
        <SidePanel
          title="Transfer Tokens"
          opened={opened === 'transfer'}
          onClose={closeSidePanel}
        >
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
      )}
    </TransactionsContext.Consumer>
  </div>
)
