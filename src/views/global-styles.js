export const theme = {
  contentBackground: '#FFFFFF',
  contentBorder: '#E6E6E6',
  contentBorderActive: '#F2F2F2',
  textPrimary: '#000000',
  textSecondary: '#707070',
  gradientRight: '#8FD3F4',
  gradientLeft: '#84FAB0',
}

export const colors = {
  offBlack: '#333',
  darkBlue: '#203260',
  magenta: '#ff387a',
  orange: '#ffaf36',
  turquoise: '#4be5ce',
  prism: '#15afba',
  darkRed: '#9A4540',
  blue2: '#A4BEE7',
  gradient: {
    right: '#8FD3F4',
    left: '#84FAB0',
  },
  lightBg: '#F8FAFB',
  brightBlue: '#00AFF3',
  mutedBlue: '#ADC8D9',
}

const FONT_SIZES = {
  xxsmall: '8px',
  xsmall: '10px',
  small: '12px',
  normal: '14px',
  large: '16px',
  xlarge: '18px',
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
    line-height: 1;
  `
}
