import React, { Component } from 'react'

import { MarginDiv, FileInput } from 'components/StyledHome'
import Button from 'components/Button'

import SidePanel from './components/SidePanel'
import { TransactionsContext } from './index'

class ClaimReward extends Component {
  render() {
    return (
      <TransactionsContext.Consumer>
        {({
          selectedOne,
          opened,
          closeSidePanel,
          handleFileInput,
          handleClaimReward,
          account,
          voting,
          registry,
        }) => (
          <SidePanel
            title="Claim Reward"
            opened={opened === 'claimReward'}
            onClose={closeSidePanel}
          >
            <MarginDiv>
              <FileInput type="file" name="file" onChange={handleFileInput} />
            </MarginDiv>

            <MarginDiv>
              <Button onClick={handleClaimReward} mode="strong" wide>
                {'Claim Reward'}
              </Button>
            </MarginDiv>
          </SidePanel>
        )}
      </TransactionsContext.Consumer>
    )
  }
}

export default ClaimReward
