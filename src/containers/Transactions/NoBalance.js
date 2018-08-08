import React from 'react'

import { MarginDiv } from 'components/StyledHome'

import { SideText } from './components'
import SidePanelSeparator from './components/SidePanelSeparator'
import SidePanel from './components/SidePanel'

export default ({ opened, closeTxPanel, tcr, handleInputChange }) => (
  <div>
    <SidePanel title="Start an Application" opened={opened} onClose={closeTxPanel}>
      <SidePanelSeparator />

      <MarginDiv>
        <SideText
          color="red"
          text={`You must have ${tcr.tokenName} to participate in this TCR`}
        />
      </MarginDiv>

      <SidePanelSeparator />
    </SidePanel>
  </div>
)
