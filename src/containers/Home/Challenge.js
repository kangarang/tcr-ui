import React, { Component } from 'react'

import {
  SidePanel,
  SidePanelSeparator,
  Button,
  Text,
  TextInput,
} from '@aragon/ui'

import translate from 'translations'

import { SideSplit, SideText } from 'components/Transaction'
import { MarginDiv } from 'components/StyledHome'

import { withCommas, baseToConvertedUnit } from 'utils/_units'

export default class Challenge extends Component {
  render() {
    const {
      closeSidePanel,
      token,
      parameters,
      balances,
      handleInputChange,
      handleSendTransaction,
      openChallenge,
      visibleApprove,
      selectedOne,
    } = this.props
    return (
      <div>
        <SidePanel
          title="Challenge listing"
          opened={openChallenge}
          onClose={closeSidePanel}
        >
          <SideSplit
            leftTitle={'Challenge Period'}
            leftItem={
              <div>{`Commit: ${parameters.get(
                'commitStageLen'
              )} seconds & Reveal: ${parameters.get(
                'revealStageLen'
              )} seconds`}</div>
            }
            rightTitle={'Minimum Deposit'}
            rightItem={
              <div>
                {baseToConvertedUnit(
                  parameters.get('minDeposit'),
                  18
                ).toString()}{' '}
                {token.symbol}
              </div>
            }
          />

          <SideSplit
            leftTitle={'Token Balance'}
            leftItem={balances.get('token')}
            rightTitle={'Registry Allowance'}
            rightItem={withCommas(balances.get('registryAllowance'))}
          />

          <SideText
            small
            title={'LISTING'}
            text={selectedOne && selectedOne.get('data')}
          />

          <SideText
            small
            title={'WARNING'}
            text={translate('sidebar_challenge_instructions')}
            icon={'exclamation triangle'}
          />

          <SidePanelSeparator />

          <MarginDiv>
            {/* {Number(balances.get('registryAllowance')) <
            baseToConvertedUnit(parameters.get('minDeposit'), 18) ? ( */}
            <MarginDiv>
              <MarginDiv>
                <Text color="grey" smallcaps>
                  {'TOKEN AMOUNT TO APPROVE'}
                </Text>
                <TextInput
                  onChange={e => handleInputChange(e, 'numTokens')}
                  wide
                  type="number"
                />
              </MarginDiv>
              <MarginDiv>
                <Button
                  onClick={e =>
                    handleSendTransaction('approve', null, 'registry')
                  }
                  mode="strong"
                  wide
                >
                  {'Approve tokens for Registry'}
                </Button>
              </MarginDiv>
            </MarginDiv>
            {/* ) : ( */}
            <Button
              onClick={e => handleSendTransaction('challenge')}
              mode="strong"
              wide
            >
              {'CHALLENGE'}
            </Button>
            {/* )} */}
          </MarginDiv>
        </SidePanel>
      </div>
    )
  }
}
