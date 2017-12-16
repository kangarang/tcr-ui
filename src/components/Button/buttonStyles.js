import { css } from 'styled-components';

const buttonStyles = css`
  display: inline-block;
  box-sizing: border-box;
  padding: .5em 1em;
  text-decoration: none;
  -webkit-font-smoothing: antialiased;
  -webkit-touch-callout: none;
  user-select: none;
  cursor: pointer;
  outline: 0;
  font-weight: bold;
  font-size: 16px;
  color: #52427c;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px transparent;
  position: relative;
  &:before {
    content: '';
    position: absolute;
    border: #52427c solid 3px;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -webkit-transition-property: top, right, bottom, left;
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
