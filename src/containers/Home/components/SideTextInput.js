import React from 'react'
import styled from 'styled-components'

import { Text } from '@aragon/ui'

import { Icon } from 'semantic-ui-react'
import translate from '../../../translations'

const MarginDiv = styled.div`
  margin: 1em 0;
`
export default ({ icon, title, text, small }) => (
  <div>
    <MarginDiv>
      {icon && <Icon name={icon} size="small" />}
      <Text color="grey" smallcaps={small}>
        {title}
      </Text>
    </MarginDiv>
    <MarginDiv>
      <Text>{text}</Text>
    </MarginDiv>
  </div>
)
