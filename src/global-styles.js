import { injectGlobal } from 'styled-components'
import { colors } from './components/Colors'

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    color: ${colors.offBlack};
    margin: 0;
    font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  }

  div {
    outline: none;
    box-sizing: border-box;
  }

  p,
  label {
    line-height: 1em;
  }

  h4 {
    margin: 0;
  }
`
