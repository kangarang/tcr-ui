import styled from 'styled-components';
import { colors } from '../Colors'

// const Input = styled.input`
//   outline: none;
//   border-bottom: 1px dotted #999;
// `;

const Input = styled.input`
  width: 100%;
  border: none;
  border-bottom: 1px solid ${colors.prism};
  font-size: 1em;
  padding: .2em;
  color: ${colors.offBlack};
  
`
export default Input;
