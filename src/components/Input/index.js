import styled from 'styled-components';
import { colors } from '../Colors'

// const Input = styled.input`
//   outline: none;
//   border-bottom: 1px dotted #999;
// `;

const Input = styled.input`
  background-color: rgba(0, 0, 0, 0.4);
  border: none;
  border-bottom: 2px solid ${colors.prism};
  font-size: 1em;
  padding: .75em;
  color: white;
`
export default Input;
