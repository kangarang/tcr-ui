import React from 'react'
import translate from 'translations'

import { MarginDiv } from 'components/StyledHome'
import Countdown from 'components/Countdown'
import Button from 'components/Button'

import SidePanelSeparator from './components/SidePanelSeparator'
import TotalAmount from './components/TotalAmount'
import SidePanel from './components/SidePanel'
import SideText from './components/SideText'

import { TransactionsContext } from './index'

export default class Challenge extends React.Component {
  state = {
    data: '',
  }
  handleChangeData = e => this.setState({ data: e.target.value })
  render() {
    return (
      <TransactionsContext.Consumer>
        {({
          needToApproveRegistry,
          closeTxPanel,
          handleApprove,
          onSendTx,
          selectedOne,
          parameters,
          opened,
          tcr,
        }) => (
          <SidePanel
            title="Challenge a Listing"
            opened={opened === 'challenge'}
            onClose={closeTxPanel}
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
                  selectedOne && selectedOne.appExpiry
                    ? selectedOne.appExpiry.date
                    : false
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
                <Button
                  onClick={() => onSendTx('approveRegistry', this.state)}
                  mode="strong"
                >
                  {'Approve tokens for Registry'}
                </Button>
              ) : (
                <Button
                  methodName="challenge"
                  onClick={() => onSendTx('challenge', this.state)}
                  mode="strong"
                  wide
                >
                  {'CHALLENGE'}
                </Button>
              )}
            </MarginDiv>
          </SidePanel>
        )}
      </TransactionsContext.Consumer>
    )
  }
}
