import { css } from 'styled-components';
import { colors } from '../Colors'

const buttonStyles = css`
  display: inline-block;
  box-sizing: border-box;
  padding: 1.5em;
  text-decoration: none;
  -webkit-font-smoothing: antialiased;
  -webkit-touch-callout: none;
  user-select: none;
  cursor: pointer;
  outline: 0;
  font-weight: bold;
  font-size: 12px;
  color: ${colors.purple};
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px transparent;
  background-color: ${colors.offWhite};
  position: relative;
  z-index: 3;

  &:before {
    content: '';
    position: absolute;
    border: 2px solid ${colors.purple};
    border-radius: 4px;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    -webkit-transition-property: top, right, bottom, left;
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    transition-property: top, right, bottom, left;
  }
  &:hover:before, &:focus:before, &:active:before {
    top: -4px;
    right: -4px;
    bottom: -4px;
    left: -4px;
  }
`;

export default buttonStyles;
