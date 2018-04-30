import React from 'react'
import styled from 'styled-components'

import Text from 'views/components/Text'
import TextInput from 'views/components/TextInput'

const MarginDiv = styled.div`
  margin: 1em 0;
`
const styles = {
  textInput: {
    height: '40px',
  },
}
export default ({ title, type, handleInputChange, placeholder, value }) => (
  <div>
    <MarginDiv>
      <Text color="grey" smallcaps>
        {title}
      </Text>
    </MarginDiv>
    <MarginDiv>
      <TextInput
        onChange={handleInputChange}
        type={type}
        style={styles.textInput}
        placeholder={placeholder}
        value={value}
      />
    </MarginDiv>
  </div>
)
