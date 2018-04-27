import { css } from 'styled-components'
import { colors, font } from '../../global-styles'

const buttonStyles = css`
  display: inline-block;
  outline: 0;
  user-select: none;
  cursor: pointer;
  padding: ${({ wide }) => (wide ? '0.5em 1.5em' : '0.5em 1em')};
  width: ${({ wide }) => (wide ? '100%' : 'auto')};

  font-size: 14px;
  ${({ color }) => {
    return `color: ${color || colors.offBlack}`
  }};
  ${({ size, weight }) => font({ size, weight })};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  letter-spacing: 1.5px;

  background-color: ${({ bgColor }) => bgColor && bgColor};
  border: 2px solid transparent;
  border-image: linear-gradient(
    to right,
    ${colors.gradient.left} 0%,
    ${colors.gradient.right} 100%
  );
  border-image-slice: ${({ bgColor }) => (bgColor ? '0' : '2')};

  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.22s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
    filter: brightness(120%);
    color: ${({ fgColor }) => (fgColor ? 'hsl(192, 17%, 99%)' : colors.magenta)};
  }
`

export default buttonStyles
