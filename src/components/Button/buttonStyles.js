import { css } from 'styled-components'
import { colors } from '../Colors'

const buttonStyles = css`
  position: relative;
  display: inline-block;
  box-shadow: 0px 2px 4px rgba(0,0,0,0.18);
  padding: .7em .75em;
  outline: 0;
  text-shadow: 0 1px 2px rgba(0,0,0,0.20);
  letter-spacing: 1.5px;

  /* -webkit-font-smoothing: antialiased;
  -webkit-touch-callout: none;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0); */
  user-select: none;
  cursor: pointer;

  font-weight: bold;
  font-size: 14px;

  /* color: ${colors.magenta}; */
  color: hsl(192,17%,99%);
  /* background-color: hsl(192,17%,99%); */
  background: linear-gradient(${colors.prism}, ${colors.blue3});
  /*  hsl(208, 100%, 100%), hsl(194, 100%, 80%) */
  border-radius: 4px;

  &:before {
    /* content: ''; */
    /* position: absolute;
    border: 2px solid ${colors.prism};
    border-radius: 4px;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    -webkit-transition-property: top, right, bottom, left;
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    transition-property: top, right, bottom, left; */
  }

  &:hover:before, &:focus:before, &:active:before {
    /* top: -2px;
    right: -2px;
    bottom: -2px;
    left: -2px; */
  }
`

export default buttonStyles
