import React from 'react'
import styled from 'styled-components'

import { Text, TextInput } from '@aragon/ui'

const MarginDiv = styled.div`
  margin: 1em 0;
`
const styles = {
  textInput: {
    height: '50px',
  },
}
export default ({ title, type, handleInputChange }) => (
  <div>
    <MarginDiv>
      <Text color="grey" smallcaps>
        {title}
      </Text>
    </MarginDiv>
    <MarginDiv>
      <TextInput onChange={handleInputChange} wide type={type} style={styles.textInput} />
    </MarginDiv>
  </div>
)
