import React from 'react'
import styled from 'styled-components'

import { Text } from '@aragon/ui'

const MarginDiv = styled.div`
  margin: 1em 0;
`
export default ({ title, text, small }) => (
  <div>
    {title && (
      <MarginDiv>
        <Text color="grey" smallcaps={small}>
          {title}
        </Text>
      </MarginDiv>
    )}
    <MarginDiv>
      <Text>{text}</Text>
    </MarginDiv>
  </div>
)
