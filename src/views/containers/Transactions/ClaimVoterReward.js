import React from 'react'

// import { SideSplit, SideText } from 'views/containers/Transactions/components'

import { MarginDiv, FileInput } from 'views/components/StyledHome'
import Button from 'views/components/Button'
// import Text from 'views/components/Text'

import SidePanel from './components/SidePanel'

export default ({ opened, closeSidePanel, handleFileInput, handleClaimVoterReward }) => (
  <SidePanel title="Claim Voter Reward" opened={opened} onClose={closeSidePanel}>
    <MarginDiv>
      <FileInput type="file" name="file" onChange={handleFileInput} />
    </MarginDiv>

    <MarginDiv>
      <Button onClick={handleClaimVoterReward} mode="strong" wide>
        {'Claim Voter Reward'}
      </Button>
    </MarginDiv>
  </SidePanel>
)
