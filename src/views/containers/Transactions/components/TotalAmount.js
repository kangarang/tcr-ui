import React from 'react'
import styled from 'styled-components'

import Text from 'views/components/Text'

const FlexSpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2em 0;
`

export default ({ minDeposit, tokenSymbol, copy }) => (
  <FlexSpaceBetween>
    <Text size="large" weight="normal" color="black">
      {copy}
    </Text>
    <Text size="large" weight="bold" color="black">
      {`${minDeposit} ${tokenSymbol}`}
    </Text>
  </FlexSpaceBetween>
)
