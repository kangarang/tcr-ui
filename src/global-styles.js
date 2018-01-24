import { injectGlobal } from 'styled-components'

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    /* height: 100%; */
    /* width: 100%; */
    color: #2a2825;
    margin: 0;
  }

  body {
    font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    & > div {
      font-family: 'Harmonia Sans Mono Std';
    }
  }

  div {
    box-sizing: border-box;
  }
  /* #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  } */

  p,
  label {
    line-height: 1.5em;
  }

  h4 {
    margin: 0;
  }
`
