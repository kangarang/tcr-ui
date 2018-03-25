import React from 'react'
import styled from 'styled-components'

import { Text } from '@aragon/ui'

const MarginDiv = styled.div`
  margin: 2em 0;
`
export default ({ title, text, small, color }) => (
  <div>
    {title && (
      <MarginDiv>
        <Text color="grey" smallcaps={small}>
          {title}
        </Text>
      </MarginDiv>
    )}
    <MarginDiv>
      <Text color={color}>{text}</Text>
    </MarginDiv>
  </div>
)
