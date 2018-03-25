import React from 'react'
import translate from 'translations'

import SidePanel from './SidePanel'
import TxnProgress from './TxnProgress'

import { MarginDiv } from 'components/StyledHome'
import Button from 'components/Button'
import Countdown from 'components/Countdown'

import { SideText } from './components'
import TotalAmount from './components/TotalAmount'
import SidePanelSeparator from './components/SidePanelSeparator'

export default ({
  opened,
  closeSidePanel,
  token,
  contracts,
  parameters,
  balances,
  handleInputChange,
  handleApprove,
  handleChallenge,
  selectedOne,
  miningStatus,
}) => (
  <div>
    <SidePanel title="Challenge a Listing" opened={opened} onClose={closeSidePanel}>
      <SidePanelSeparator />

      <SideText text={selectedOne && selectedOne.get('ipfsID')} />
      <Countdown end={selectedOne && selectedOne.getIn(['appExpiry', 'date'])} />

      <SidePanelSeparator />

      <SideText small color="grey" text={translate('ins_challenge')} />

      <TotalAmount
        copy={'Total Stake'}
        minDeposit={parameters.get('minDeposit')}
        tokenSymbol={contracts.get('tokenSymbol')}
      />

      <SidePanelSeparator />

      <SideText color="grey" text={translate('mm_challenge')} />

      <MarginDiv>
        <Button onClick={handleChallenge} mode="strong" wide>
          {'CHALLENGE'}
        </Button>
        {miningStatus && <TxnProgress />}
      </MarginDiv>

      {/* <MarginDiv>
          <Text color="grey" smallcaps>
            {'TOKEN AMOUNT'}
          </Text>
          <TextInput onChange={e => handleInputChange(e, 'numTokens')} wide type="number" />
          <Button onClick={e => handleApprove('registry')} mode="strong" wide>
            {'Approve tokens for Registry'}
          </Button>
        </MarginDiv> */}
      {/* <SideSplit
        leftTitle={'Challenge Period'}
        leftItem={
          <div>{`Commit: ${parameters.get('commitStageLen')} seconds & Reveal: ${parameters.get(
            'revealStageLen'
          )} seconds`}</div>
        }
        rightTitle={'Minimum Deposit'}
        rightItem={<div>{`${parameters.get('minDeposit')} ${contracts.get('tokenSymbol')}`}</div>}
      />

      <SideSplit
        leftTitle={'Token Balance'}
        leftItem={balances.get('token')}
        rightTitle={'Registry Allowance'}
        rightItem={withCommas(balances.get('registryAllowance'))}
      /> */}
    </SidePanel>
  </div>
)
