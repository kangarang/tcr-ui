import { injectGlobal } from 'styled-components'

export const colors = {
  offBlack: '#333',
  darkBlue: '#203260',
  magenta: '#ff387a',
  orange: '#ffaf36',
  turquoise: '#4be5ce',
  prism: '#15afba',
  darkRed: '#9A4540',
  blue2: '#A4BEE7',
  greyBg: '#E8EAEA',
  gradient: {
    right: '#8FD3F4',
    left: '#84FAB0',
  },
  lightBg: '#F8FAFB',
  brightBlue: '#00AFF3',
}

const globalStyles = `
  html {
    margin: 0;
    body {
      line-height: 1.5em;
      color: ${colors.offBlack};
      font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
    }
  }
  div {
    outline: none;
    box-sizing: border-box;
  }

  h4 {
    margin: 0;
  }
`

export const jsonTheme = {
  scheme: 'monokai',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633',
}

const FONT_SIZES = {
  xxsmall: '11px',
  xsmall: '12px',
  small: '14px',
  normal: '15px',
  large: '16px',
  xlarge: '20px',
  xxlarge: '22px',
  great: '37px',
}

const FONT_WEIGHTS = {
  normal: '400',
  bold: '600',
  bolder: '800',
}

export const font = ({ size = 'normal', weight = 'normal' }) => {
  const fontSize = FONT_SIZES[size] || FONT_SIZES.normal
  const fontWeight = FONT_WEIGHTS[weight] || FONT_WEIGHTS.normal
  return `
    font-size: ${fontSize};
    font-weight: ${fontWeight};
    line-height: 1.5;
  `
}

export default () => {
  injectGlobal`${globalStyles}`
}
