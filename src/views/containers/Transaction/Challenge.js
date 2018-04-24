import React from 'react'
import translate from 'views/translations'

import { MarginDiv } from 'views/components/StyledHome'
import Button from 'views/components/Button'
import Countdown from 'views/components/Countdown'

import SidePanel from './components/SidePanel'
import { SideText } from './components'
import TotalAmount from './components/TotalAmount'
import SidePanelSeparator from './components/SidePanelSeparator'

import TxnProgress from './TxnProgress'

export default ({
  opened,
  closeSidePanel,
  token,
  tcr,
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
        tokenSymbol={tcr.get('tokenSymbol')}
      />

      <SidePanelSeparator />

      <SideText color="grey" text={translate('mm_challenge')} />

      <MarginDiv>
        <Button onClick={handleChallenge} mode="strong" wide>
          {'CHALLENGE'}
        </Button>
        {miningStatus && (
          <div>
            <Button
              href={`https://rinkeby.etherscan.io/tx/${latestTxn.get('transactionHash')}`}
            >
              {'etherscan'}
            </Button>
            <TxnProgress />
          </div>
        )}
      </MarginDiv>
    </SidePanel>
  </div>
)
