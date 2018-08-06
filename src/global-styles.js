import { createMuiTheme } from '@material-ui/core/styles'

export const theme = {
  contentBackground: '#FFFFFF',
  contentBorder: '#E6E6E6',
  contentBorderActive: '#F2F2F2',
  textPrimary: '#000000',
  textSecondary: '#707070',
  gradientRight: '#8FD3F4',
  gradientLeft: '#84FAB0',
  fontFamily: 'Avenir Next',
}

export const notUsed = {
  aquamarine: '#74FAB0',
  blue: '#3C8BFB',
  brightGreen: '#74FAB0',
  cyan: '#37BEA9',
  darkRed: '#D0021B',
  mutedBlue: '#ADC8D9',
  orange: '#ffaf36',
  paleturquoise: '#A8EDEA',
  pigpink: '#F9D7E3',
  spray: '#85D3D4',
  turquoise: '#4be5ce',
}

export const grays = {
  base: '#000',
  darker: '#1c1c1c',
  dark: '#333',
  gray: '#737373',
  light: '#9a9a9a',
  lighter: '#ececec',
  lightest: '#fafafa',
}

export const colors = {
  blue2: '#A4BEE7',
  brightBlue: '#00AFF3',
  darkBlue: '#203260',
  darkGrey: '#788995',
  paleGrey: '#B9C7CF',
  magenta: '#ff387a',
  lightBg: '#F8FAFB',
  offBlack: '#333',
  prism: '#15afba',

  gradient: {
    claimReward: {
      right: '#85D3D4',
      left: '#74FAB0',
      shadow: '#F9D7E3',
    },
    requestVotingRights: {
      right: '#85D3D4',
      left: '#74FAB0',
      shadow: '#F9D7E3',
    },
    transfer: {
      right: '#D0021B',
      left: '#3C8BFB',
      shadow: '#F9D7E3',
    },
    revealVote: {
      right: '#D0021B',
      left: '#3C8BFB',
      shadow: '#F9D7E3',
    },
    commitVote: {
      right: '#85D3D4',
      left: '#74FAB0',
      shadow: '#F9D7E3',
    },
    approve: {
      right: '#8FD3F4',
      left: '#84FAB0',
      shadow: '#F9D7E3',
    },
    apply: {
      right: '#8FD3F4',
      left: '#84FAB0',
      shadow: '#F9D7E3',
    },
    challenge: {
      right: '#D0021B',
      left: '#3C8BFB',
      shadow: '#F9D7E3',
    },
    download: {
      right: '#A8EDEA',
      left: '#F9D7E3',
      shadow: '#F9D7E3',
    },
    updateStatus: {
      right: '#A8EDEA',
      left: '#F9D7E3',
      shadow: '#afe7ff',
    },
    back: {
      right: '#D0021B',
      left: '#3C8BFB',
      shadow: '#F9D7E3',
    },
    next: {
      right: '#8FD3F4',
      left: '#84FAB0',
      shadow: '#F9D7E3',
    },
  },
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
  `
}

export const muiTheme = createMuiTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#74FAB0',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
  typography: {
    fontWeightRegular: FONT_WEIGHTS.normal,
    fontWeightBold: FONT_WEIGHTS.bold,
    fontWeightBolder: FONT_WEIGHTS.bolder,
  },
})
