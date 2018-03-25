import React from 'react'
import { Text } from '@aragon/ui'
import translate from 'translations'
import { withCommas } from 'utils/_values'

import SidePanel from './SidePanel'
import TxnProgress from './TxnProgress'

import Button from 'components/Button'
import { SideSplit, SideText } from 'containers/Transaction/components'
import { MarginDiv, FileInput } from 'components/StyledHome'
import SidePanelSeparator from './components/SidePanelSeparator'

export default ({
  opened,
  closeSidePanel,
  parameters,
  balances,
  handleFileInput,
  handleRevealVote,
  selectedOne,
  miningStatus,
}) => (
  <SidePanel
    title="Claim Voter Reward"
    opened={this.state.opened === 'claimVoterReward'}
    onClose={this.closeSidePanel}
  >
    <SideSplit
      leftTitle={'Reveal Period'}
      leftItem={`Reveal: ${parameters.get('revealStageLen')} seconds`}
      rightTitle={'POLL ID'}
      rightItem={this.state.selectedOne && this.state.selectedOne.getIn(['latest', 'pollID'])}
    />
    <SideSplit
      leftTitle={'Token Balance'}
      leftItem={withCommas(balances.get('token'))}
      rightTitle={'Voting Allowance'}
      rightItem={withCommas(balances.get('votingAllowance'))}
    />

    <SideText small text={'CLAIM VOTER REWARD'} />
    <SideText small text={this.state.voterReward} />

    <SidePanelSeparator />

    <SideText small text={'INSTRUCTIONS'} />

    <SideText text={translate('sidebar_claimVoterReward_instructions')} />

    <MarginDiv>
      <FileInput type="file" name="file" onChange={this.handleFileInput} />
    </MarginDiv>
    <MarginDiv>
      <Button onClick={this.handleClaimVoterReward} mode="strong" wide>
        {'Claim Voter Reward'}
      </Button>
    </MarginDiv>
    {miningStatus && <TxnProgress />}
  </SidePanel>
)
