import React from 'react'

import {
  SidePanel,
  SidePanelSeparator,
  Button,
  Text,
  TextInput,
} from '@aragon/ui'

import translate from 'translations'

import { SideSplit, SideText } from 'components/SidePanelOverlay'
import { MarginDiv } from 'components/StyledHome'
import TxnProgress from '../Transaction/TxnProgress'

import { withCommas } from 'utils/_values'

export default ({
  closeSidePanel,
  token,
  contracts,
  parameters,
  balances,
  handleInputChange,
  handleSendTransaction,
  openChallenge,
  visibleApprove,
  selectedOne,
  miningStatus,
}) => (
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
            {`${parameters.get('minDeposit')} ${contracts.get('tokenSymbol')}`}
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
      />

      <SidePanelSeparator />

      <MarginDiv>
        <MarginDiv>
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
            <Button
              onClick={e => handleSendTransaction('approve', null, 'registry')}
              mode="strong"
              wide
            >
              {'Approve tokens for Registry'}
            </Button>
          </MarginDiv>
        </MarginDiv>
        <Button
          onClick={e => handleSendTransaction('challenge')}
          mode="strong"
          wide
        >
          {'CHALLENGE'}
        </Button>
        {miningStatus && <TxnProgress />}
      </MarginDiv>
    </SidePanel>
  </div>
)
