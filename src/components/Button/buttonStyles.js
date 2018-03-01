import { css } from 'styled-components'
import { colors } from '../../colors'

const buttonStyles = css`
  display: inline-block;
  padding: 0.7em 1.4em;
  outline: 0;
  user-select: none;
  cursor: pointer;

  color: hsl(192, 17%, 99%);
  font-weight: bold;
  font-size: 14px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  letter-spacing: 1.5px;

  background: linear-gradient(${colors.prism}, ${colors.blue3});
  border-radius: 3px;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);

  transition: all 0.22s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
    filter: brightness(130%);
    color: hsl(192, 17%, 99%);
  }
`

export default buttonStyles
