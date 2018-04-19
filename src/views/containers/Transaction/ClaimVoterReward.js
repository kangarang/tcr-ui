import React from 'react'
import translate from 'translations'

import { SideSplit, SideText } from 'views/containers/Transaction/components'

import { MarginDiv, FileInput } from 'views/components/StyledHome'
import Button from 'views/components/Button'
import Text from 'views/components/Text'

import SidePanelSeparator from './components/SidePanelSeparator'
import SidePanel from './components/SidePanel'
import TxnProgress from './TxnProgress'

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
        <Button href={`https://rinkeby.etherscan.io/tx/${latestTxn.get('transactionHash')}`}>
          {'etherscan'}
        </Button>
        <TxnProgress />
      </div>
    )}
  </SidePanel>
)
