import React, { Component } from 'react'
import translate from 'translations'

import { MarginDiv } from 'components/StyledHome'
import Button from 'components/Button'
import { baseToConvertedUnit } from 'libs/units'

import { SideSplit, SideText } from 'containers/Transactions/components'
import SidePanel from './components/SidePanel'
import SidePanelSeparator from './components/SidePanelSeparator'
import { TransactionsContext } from './index'

export default class UpdateStatus extends Component {
  state = {
    didCommit: false,
    didReveal: false,
    numTokens: '',
    votesFor: '',
    votesAgainst: '',
  }

  render() {
    return (
      <TransactionsContext.Consumer>
        {({ selectedOne, closeSidePanel, onSendTx, opened, tcr }) => (
          <SidePanel
            title="Update a listing's status"
            opened={opened === 'updateStatus'}
            onClose={closeSidePanel}
          >
            {selectedOne && (
              <div>
                <SideSplit
                  leftTitle={'Votes For'}
                  leftItem={baseToConvertedUnit(selectedOne.votesFor, tcr.tokenDecimals)}
                  rightTitle={'Votes Against'}
                  rightItem={baseToConvertedUnit(
                    selectedOne.votesAgainst,
                    tcr.tokenDecimals
                  )}
                />
                <SideSplit
                  leftTitle={'Tokens you voted with'}
                  leftItem={
                    selectedOne &&
                    baseToConvertedUnit(selectedOne.userVotes, tcr.tokenDecimals)
                  }
                  rightTitle={'Total Votes'}
                  rightItem={
                    selectedOne &&
                    baseToConvertedUnit(selectedOne.totalVotes, tcr.tokenDecimals)
                  }
                />
                <SideText text={selectedOne && selectedOne.listingID} />
              </div>
            )}

            <SidePanelSeparator />

            <SideText small color="grey" text={translate('ins_updateStatus')} />

            <MarginDiv>
              {selectedOne && (
                <Button
                  onClick={e => onSendTx('updateStatus', {})}
                  mode="strong"
                  wide
                  methodName="updateStatus"
                >
                  {'UPDATE STATUS'}
                </Button>
              )}
            </MarginDiv>
          </SidePanel>
        )}
      </TransactionsContext.Consumer>
    )
  }
}
