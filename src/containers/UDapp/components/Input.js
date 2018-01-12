import styled from 'styled-components';
import { colors } from '../../../components/Colors'

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${colors.prism};
  font-size: 1em;
  padding: .2em;
  margin: .2em;
  color: ${colors.offBlack};
`
export default Input;
