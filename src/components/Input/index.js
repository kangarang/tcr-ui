import styled from 'styled-components'
import { colors } from '../Colors'

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid ${colors.prism};
  font-size: 1.3em;
  padding: 0.5em;
  color: ${colors.offBlack};
  background-color: ${colors.offWhite};
  font-family: 'Harmonia Sans Mono Std', monospace;
`
export default Input
