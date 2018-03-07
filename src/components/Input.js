import styled from 'styled-components'
import { colors } from '../colors'

const Input = styled.input`
  width: 95%;
  box-sizing: border-box;
  border: ${props => (props.noBorder ? `none` : `1px solid ${colors.prism}`)};
  /* border: none; */
  font-size: 1em;
  padding: 0.3em;
  margin: 3px 5px;
  color: ${colors.offBlack};
  background-color: ${colors.offWhite};
  font-family: 'Iosevka', monospace;
`
export default Input
