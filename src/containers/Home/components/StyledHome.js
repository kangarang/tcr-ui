import React from 'react'
import styled from 'styled-components'
import { colors, jsonTheme } from '../../../colors'

export const AppBarWrapper = styled.div`
  flex-shrink: 0;
`
export const AppBar = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 4em;
  background-color: ${colors.offWhite};
  border-bottom: 1px solid ${colors.orange};
  padding: 0 3em;
  & > div {
    margin: 0 1em;
  }
`
export const MarginDiv = styled.div`
  margin: 1em 0;
`
export const OverFlowDiv = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
`
export const HomeWrapper = styled.div`
  padding: 2em;
`

export const CMItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 20px;
  cursor: pointer;
  white-space: nowrap;
  & > div {
    padding: 5px;
  }
`
export const FileInput = styled.input`
  padding: 1em;
  border: 2px solid ${colors.prism};
`