import React from 'react'
import translate from 'views/translations'

import { MarginDiv } from 'views/components/StyledHome'
import Button from 'views/components/Button'

import SidePanel from './components/SidePanel'
import { SideText } from './components'
import SidePanelSeparator from './components/SidePanelSeparator'

export default ({
  opened,
  closeSidePanel,
  handleInputChange,
  handleUpdateStatus,
  selectedOne,
}) => (
  <div>
    <SidePanel title="Update a listing's status" opened={opened} onClose={closeSidePanel}>
      <SideText text={selectedOne && selectedOne.get('listingID')} />

      <SidePanelSeparator />

      <SideText small color="grey" text={translate('ins_updateStatus')} />

      <MarginDiv>
        <Button
          onClick={e => handleUpdateStatus(selectedOne.get('listingHash'))}
          mode="strong"
          wide
        >
          {'UPDATE STATUS'}
        </Button>
      </MarginDiv>
    </SidePanel>
  </div>
)
