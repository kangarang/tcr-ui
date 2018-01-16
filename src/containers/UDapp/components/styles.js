import React from 'react'

import { css } from 'styled-components'
import { colors } from '../../../components/Colors'

const buttonStyles = css`
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  outline: 0;

  text-decoration: none;
  user-select: none;
  cursor: pointer;

  font-size: 14px;
  font-weight: bold;

  color: ${colors.magenta};
  background-color: ${colors.offWhite};
  border: 2px solid ${colors.purple};
  border-radius: 4px;
`

export default buttonStyles