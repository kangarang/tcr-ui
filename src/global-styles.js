import { injectGlobal } from 'styled-components'
import { colors } from './components/Colors';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    color: #2a2825;
    margin: 0;
    font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  }

  div {
    box-sizing: border-box;
  }

  p,
  label {
    line-height: 1.5em;
  }

  h4 {
    margin: 0;
  }
`
