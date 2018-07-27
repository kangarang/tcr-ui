import React from 'react'
import styled from 'styled-components'

const RadioWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1em;
`

class Radio extends React.Component {
  render() {
    const { checked, handleCheckRadio, ...props } = this.props
    return (
      <RadioWrapper>
        <input type="radio" checked={checked} onChange={handleCheckRadio} {...props} />
      </RadioWrapper>
    )
  }
}

export default Radio
