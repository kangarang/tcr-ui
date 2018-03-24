import styled from 'styled-components'
import { colors } from '../global-styles'

export const MarginDiv = styled.div`
  margin: 1em 0;
`
export const OverFlowDiv = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
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
