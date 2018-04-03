import React from 'react'
import { Text } from '@aragon/ui'
import translate from 'translations'

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
  latestTxn,
}) => (
  <SidePanel
    title="Claim Voter Reward"
    opened={this.state.opened === 'claimVoterReward'}
    onClose={this.closeSidePanel}
  >
    <MarginDiv>
      <FileInput type="file" name="file" onChange={this.handleFileInput} />
    </MarginDiv>

    <MarginDiv>
      <Button onClick={this.handleClaimVoterReward} mode="strong" wide>
        {'Claim Voter Reward'}
      </Button>
    </MarginDiv>

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
  </SidePanel>
)
