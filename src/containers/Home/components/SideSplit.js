import React from 'react'

import { SidePanelSplit, Section, Text } from '@aragon/ui'

export default ({ leftTitle, leftItem, rightTitle, rightItem }) => (
  <SidePanelSplit
    children={[
      <Section>
        <Text weight="bold">{leftTitle}</Text>
        <h2>{leftItem}</h2>
      </Section>,
      <Section>
        <Text weight="bold">{rightTitle}</Text>
        <h2>{rightItem}</h2>
      </Section>,
    ]}
  />
)
