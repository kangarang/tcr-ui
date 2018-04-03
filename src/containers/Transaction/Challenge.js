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
  latestTxn,
}) => (
  <div>
    <SidePanel title="Challenge a Listing" opened={opened} onClose={closeSidePanel}>
      <SidePanelSeparator />

      <SideText text={selectedOne && selectedOne.get('listingID')} />

      <MarginDiv>
        <Countdown end={selectedOne && selectedOne.getIn(['appExpiry', 'date'])} />
      </MarginDiv>

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
        {miningStatus && (
          <div>
            <Button href={`https://rinkeby.etherscan.io/tx/${latestTxn.get('hash')}`}>
              {'etherscan'}
            </Button>
            <TxnProgress />
          </div>
        )}
        {latestTxn && (
          <a target="_blank" href={`https://rinkeby.etherscan.io/tx/${latestTxn.get('tx')}`}>
            {latestTxn.get('tx')}
          </a>
        )}
      </MarginDiv>
    </SidePanel>
  </div>
)
