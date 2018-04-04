import React from 'react'

import { SidePanelSplit, Section } from '@aragon/ui'
import Text from 'components/Text'

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
