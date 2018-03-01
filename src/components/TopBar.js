import styled from 'styled-components'
import { colors } from '../colors'

const TopBar = styled.div`
  position: relative;
  background: linear-gradient(to right, ${colors.prism}, ${colors.darkBlue});
  height: 14px;
  width: 100%;
  z-index: 9;
`

export default TopBar
