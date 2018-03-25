import React, { Component } from 'react'
import { TextInput } from '@aragon/ui'
import translate from 'translations'

import SidePanel from './SidePanel'
import TxnProgress from './TxnProgress'

import { SideSplit, SideText } from './components'
import { MarginDiv } from 'components/StyledHome'
import Button from 'components/Button'

import SidePanelSeparator from './components/SidePanelSeparator'

import { withCommas } from 'utils/_values'
export default class CommitVote extends Component {
  render() {
    const {
      opened,
      closeSidePanel,
      balances,
      selectedOne,
      handleInputChange,
      handleApprove,
      handleCommitVote,
      handleRequestVotingRights,
      miningStatus,
    } = this.props
    return (
      <div>
        <SidePanel title="Commit Vote" opened={opened} onClose={closeSidePanel}>
          <SideSplit
            leftTitle={'Poll ID'}
            leftItem={selectedOne && selectedOne.getIn(['latest', 'pollID'])}
            rightTitle={'Token Balance'}
            rightItem={withCommas(balances.get('token'))}
          />

          {/* TODO: show inc/dec numTokens depending on user input */}
          <SideSplit
            leftTitle={'Voting Rights'}
            leftItem={balances.get('votingRights')}
            rightTitle={'Voting Allowance'}
            rightItem={withCommas(balances.get('votingAllowance'))}
          />

          <SideText
            small
            title={'COMMIT VOTE'}
            text={selectedOne && selectedOne.get('ipfsID')}
          />

          <SidePanelSeparator />

          <MarginDiv>
            <SideText text={'Token Amount'} small />
            <TextInput
              onChange={e => handleInputChange(e, 'numTokens')}
              wide
              type="number"
            />

            {balances.get('votingRights') === '0' ? (
              <MarginDiv>
                <SideText
                  text={translate('sidebar_requestVotingRights_instructions')}
                />
                <Button onClick={handleRequestVotingRights} mode="strong" wide>
                  {'Request Voting Rights'}
                </Button>
              </MarginDiv>
            ) : (
              <MarginDiv>
                <SideText text={translate('sidebar_commitVote_instructions')} />
                <Button
                  onClick={e => handleCommitVote('1')}
                  emphasis="positive"
                  mode="strong"
                >
                  {'Support the applicant'}
                </Button>
                <Button
                  onClick={e => handleCommitVote('0')}
                  emphasis="negative"
                  mode="strong"
                >
                  {'Oppose the applicant'}
                </Button>
              </MarginDiv>
            )}
          </MarginDiv>

          {miningStatus && <TxnProgress />}

          <MarginDiv>
            <SideText text={translate('sidebar_approve_instructions')} />
            <Button onClick={e => handleApprove('voting')} mode="strong" wide>
              {'Approve tokens for Voting'}
            </Button>
          </MarginDiv>
        </SidePanel>
      </div>
    )
  }
}
