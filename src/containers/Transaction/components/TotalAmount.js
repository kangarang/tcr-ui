import React from 'react'
import styled from 'styled-components'
import { Text } from '@aragon/ui'

import { MarginDiv } from 'components/StyledHome'

const FlexSpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
`

export default ({ minDeposit, tokenSymbol, copy }) => (
  <MarginDiv>
    <FlexSpaceBetween>
      <Text size="large" weight="normal" color="black">
        {copy}
      </Text>
      <Text size="large" weight="bold" color="black">
        {`${minDeposit} ${tokenSymbol}`}
      </Text>
    </FlexSpaceBetween>
  </MarginDiv>
)
