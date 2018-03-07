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
import { withCommas, baseToConvertedUnit, BN } from 'utils/units_utils'

import { MarginDiv } from 'components/StyledHome'

export default class Apply extends Component {
  constructor() {
    super()
    this.state = {
      activeItem: 0,
    }
  }

  handleChange(index) {
    this.setState({ activeItem: index })
  }

  render() {
    const {
      opened,
      closeSidePanel,
      token,
      parameters,
      balances,
      handleInputChange,
      handleSendTransaction,
      openApprove,
      visibleApprove,
    } = this.props
    return (
      <div>
        <SidePanel
          title="Apply a Listing into the Registry"
          opened={opened}
          onClose={closeSidePanel}
        >
          <SideSplit
            leftTitle={'Application Period'}
            leftItem={<div>{`${parameters.get('applyStageLen')} seconds`}</div>}
            rightTitle={'Minimum Deposit'}
            rightItem={
              <div>{`${parameters.get('minDeposit')} ${token.symbol}`}</div>
            }
          />

          <SideSplit
            leftTitle={'Token Balance'}
            leftItem={balances.get('token')}
            rightTitle={'Registry Allowance'}
            rightItem={withCommas(balances.get('registryAllowance'))}
          />

          <SideSplit
            leftTitle={'Voting Rights'}
            leftItem={balances.get('votingRights')}
            rightTitle={'Voting Allowance'}
            rightItem={withCommas(balances.get('votingAllowance'))}
          />

          <SideText
            small
            title={'QUESTION'}
            text={translate('sidebar_apply_question')}
            icon={'question circle outline'}
          />
          <SideText
            small
            title={'INSTRUCTIONS'}
            text={translate('sidebar_apply_instructions')}
            icon={'check circle'}
          />

          <MarginDiv>
            <Text color="grey" smallcaps>
              {'LISTING NAME'}
            </Text>
            <TextInput
              onChange={e => handleInputChange(e, 'listingName')}
              wide
              type="text"
            />
          </MarginDiv>

          <MarginDiv>
            <Text color="grey" smallcaps>
              {'TOKEN AMOUNT'}
            </Text>
            <TextInput
              onChange={e => handleInputChange(e, 'numTokens')}
              wide
              type="number"
            />
          </MarginDiv>

          <MarginDiv>
            <Button onClick={e => handleSendTransaction('apply')} mode="strong">
              {'Apply Listing'}
            </Button>
          </MarginDiv>

          <SidePanelSeparator />

          {/* if you wanna see approve, you'll see it */}
          {/* if not, and your current allowance is greater than the minimum deposit, you won't see it */}
          <MarginDiv>
            {visibleApprove ? (
              <Button
                onClick={e =>
                  handleSendTransaction('approve', null, 'registry')
                }
                mode="strong"
              >
                {'Approve tokens for Registry'}
              </Button>
            ) : (
              <div>
                {BN(balances.get('registryAllowance')).lt(
                  BN(baseToConvertedUnit(parameters.get('minDeposit'), 18))
                ) ? (
                  <div>
                    <Text color="red">{'YOU NEED TO APPROVE'}</Text>
                    <Button
                      onClick={e =>
                        handleSendTransaction('approve', null, 'registry')
                      }
                      mode="strong"
                    >
                      {'Approve tokens for Registry'}
                    </Button>
                  </div>
                ) : (
                  <Button onClick={openApprove} mode="">
                    {'Show approve'}
                  </Button>
                )}
              </div>
            )}
          </MarginDiv>
        </SidePanel>
      </div>
    )
  }
}
