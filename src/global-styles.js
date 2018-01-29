import { injectGlobal } from 'styled-components'
import { colors } from './components/Colors'

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html {
    margin: 0;

    body {
      line-height: 1.5em;
      color: ${colors.offBlack};
      font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
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
