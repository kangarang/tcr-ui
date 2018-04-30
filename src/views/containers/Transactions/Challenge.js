import React from 'react'
import translate from 'views/translations'

import { MarginDiv } from 'views/components/StyledHome'
import Button from 'views/components/Button'
import Countdown from 'views/components/Countdown'

import SidePanel from './components/SidePanel'
import { SideText } from './components'
import TotalAmount from './components/TotalAmount'
import SidePanelSeparator from './components/SidePanelSeparator'

export default ({
  opened,
  closeSidePanel,
  tcr,
  parameters,
  handleInputChange,
  handleApprove,
  handleChallenge,
  needToApprove,
  selectedOne,
}) => (
  <div>
    <SidePanel title="Challenge a Listing" opened={opened} onClose={closeSidePanel}>
      {needToApprove && (
        <SideText small color="grey" text={translate('ins_approve_registry')} />
      )}
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
        {needToApprove ? (
          <Button onClick={e => handleApprove('registry')} mode="strong">
            {'Approve tokens for Registry'}
          </Button>
        ) : (
          <Button methodName="challenge" onClick={handleChallenge} mode="strong" wide>
            {'CHALLENGE'}
          </Button>
        )}
      </MarginDiv>
    </SidePanel>
  </div>
)
