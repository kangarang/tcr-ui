import { css } from 'styled-components'
import { colors } from '../../global-styles'

const buttonStyles = css`
  display: inline-block;
  padding: 0.5em 1.5em;
  outline: 0;
  user-select: none;
  cursor: pointer;

  color: ${colors.offBlack};
  font-size: 14px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  letter-spacing: 1.5px;

  border: 2px solid transparent;
  border-image: linear-gradient(
    to right,
    ${colors.buttonGradient.left} 0%,
    ${colors.buttonGradient.right} 100%
  );
  border-image-slice: 1;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);

  transition: all 0.22s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
    filter: brightness(110%);
    /* color: hsl(192, 17%, 99%); */
    color: ${colors.magenta};
  }
`

export default buttonStyles
