import styled from 'styled-components';
import { colors } from '../Colors'

// const Input = styled.input`
//   outline: none;
//   border-bottom: 1px dotted #999;
// `;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid ${colors.prism};
  font-size: 1.3em;
  padding: .5em;
  color: ${colors.offBlack};
  background-color: ${colors.offWhite};
  font-family: monospace;
`
export default Input;
