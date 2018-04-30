// adapted from:
// https://github.com/aragon/aragon-ui/blob/master/src/components/Input/TextInput.js
import React from 'react'
import styled from 'styled-components'

import { font, theme } from 'views/global-styles'

const StyledInput = styled.input`
  ${font({ size: 'small', weight: 'normal' })};
  width: ${({ wide }) => (wide ? '100%' : '90%')};
  padding: 0.3em 1em;
  background: ${theme.contentBackground};
  border: 1px solid ${theme.contentBorder};
  border-radius: 3px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.06);
  color: ${theme.textPrimary};
  &:focus {
    outline: none;
    border-color: ${theme.contentBorderActive};
  }
  &:read-only {
    color: transparent;
    text-shadow: 0 0 0 ${theme.textSecondary};
  }
`

const TextInput = props => <StyledInput {...props} />
TextInput.defaultProps = {
  type: 'text',
}

TextInput.Number = props => <StyledInput type="number" {...props} />

export default TextInput
