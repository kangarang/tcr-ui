import React from 'react'

import { colors } from 'global-styles'

import { MarginDiv } from 'components/StyledHome'
import Button from 'components/Button'

import { SideText, SideTextInput } from './components'
import SidePanelSeparator from './components/SidePanelSeparator'
import SidePanel from './components/SidePanel'

import { TransactionsContext } from './index'

export default class Transfer extends React.Component {
  state = {
    transferTo: '',
    numTokens: '',
  }
  handleChangeTransferTo = e => this.setState({ transferTo: e.target.value })
  handleChangeNumTokens = e => this.setState({ numTokens: e.target.value })
  render() {
    return (
      <TransactionsContext.Consumer>
        {({ closeSidePanel, opened, onSendTx }) => (
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
              handleInputChange={this.handleChangeTransferTo}
            />
            <SideTextInput
              title="Number tokens"
              type="number"
              handleInputChange={this.handleChangeNumTokens}
            />

            <SidePanelSeparator />

            <SidePanelSeparator />
            <MarginDiv>
              <Button
                methodName="transfer"
                bgColor={colors.brightBlue}
                onClick={e => onSendTx('transfer', this.state)}
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
    )
  }
}
