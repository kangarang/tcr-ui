import styled from 'styled-components'
import { colors } from '../../../colors'

export const Wrapper = styled.div`
  padding: 1em;
`
export const PaddedDiv = styled.div`
  padding: 1em;
  margin: 0 2em;
  border-bottom: 1px solid ${colors.darkBlue};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${colors.offWhite};
  box-sizing: border-box;
`
export const RightPaddedDiv = styled(PaddedDiv)`
  border: none;
  justify-content: flex-end;
`
export const HalfDiv = styled.div`
  display: inline-block;
  overflow: hidden;
  width: 50%;
`
export const LrgDiv = styled(HalfDiv)`
  min-width: 80%;
  margin: 0 1%;
  border-radius: 3px;
  font-family: 'Iosevka', monospace;
`
export const SmlDiv = styled(HalfDiv)`
  min-width: 17%;
  margin: 0 1%;
`
export const SmlBoldDiv = styled(SmlDiv)`
  font-weight: bold;
`
