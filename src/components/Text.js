import React from 'react'
import styled from 'styled-components'

import { font } from 'global-styles'

const StyledText = styled.span`
  ${({ size, weight }) => font({ size, weight })};
  ${({ smallcaps }) => {
    if (!smallcaps) return ''
    return `
      text-transform: lowercase;
      font-variant: small-caps;
    `
  }};
  ${({ color }) => {
    return `color: ${color || '#000000'}`
  }};
`

const Text = props => <StyledText {...props} />

const createTextContainer = props => {
  const Container = ({ children, color, size, smallcaps, weight }) => {
    const textProps = { color, size, smallcaps, weight }
    return <Text {...textProps}>{children}</Text>
  }

  return Container
}

Text.Block = createTextContainer('div')
Text.Paragraph = createTextContainer('p')

export default Text
