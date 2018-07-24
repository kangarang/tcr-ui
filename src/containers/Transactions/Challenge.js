import React from 'react'
import translate from 'translations'

import { MarginDiv } from 'components/StyledHome'
import Button from 'components/Button'
import Countdown from 'components/Countdown'

import SidePanel from './components/SidePanel'
import { SideText } from './components'
import TotalAmount from './components/TotalAmount'
import SidePanelSeparator from './components/SidePanelSeparator'
import { TransactionsContext } from './index'

export default () => (
  <div>
    <TransactionsContext.Consumer>
      {({
        handleChallenge,
        needToApproveRegistry,
        closeSidePanel,
        handleApprove,
        selectedOne,
        parameters,
        opened,
        tcr,
      }) => (
        <SidePanel
          title="Challenge a Listing"
          opened={opened === 'challenge'}
          onClose={closeSidePanel}
        >
          {needToApproveRegistry && (
            <SideText small color="grey" text={translate('ins_approve_registry')} />
          )}
          <SidePanelSeparator />

          <SideText size="xlarge" text={selectedOne && selectedOne.listingID} />
          <SideText text={selectedOne && selectedOne.data} />

          <MarginDiv>
            <Countdown
              end={
                selectedOne && selectedOne.appExpiry ? selectedOne.appExpiry.date : false
              }
            />
          </MarginDiv>

          <SidePanelSeparator />

          <SideText small color="grey" text={translate('ins_challenge')} />

          <TotalAmount
            copy={'Total Stake'}
            minDeposit={parameters.minDeposit}
            tokenSymbol={tcr.tokenSymbol}
          />

          <SidePanelSeparator />

          <SideText color="grey" text={translate('mm_challenge')} />

          <MarginDiv>
            {needToApproveRegistry ? (
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
      )}
    </TransactionsContext.Consumer>
  </div>
)
