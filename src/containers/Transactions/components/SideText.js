import React from 'react'
import styled from 'styled-components'

import Text from 'components/Text'

const MarginDiv = styled.div`
  margin: 2em 0;
`
export default ({ title, text, small, color, size }) => (
  <div>
    {title && (
      <MarginDiv>
        <Text color="grey" smallcaps={small} size={size}>
          {title}
        </Text>
      </MarginDiv>
    )}
    <MarginDiv>
      <Text color={color} size={size}>
        {text}
      </Text>
    </MarginDiv>
  </div>
)
