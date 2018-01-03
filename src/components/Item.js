import styled from 'styled-components'
import { colors } from './Colors'

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 12fr 6fr 6fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 5px;
  padding: .7em;
  background-color: rgba(0, 0, 0, 0.2);
  color: ${colors.offBlack};
  border: 1px solid ${colors.offBlack};
`
export const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  grid-row: ${(props) => props.gR};
  grid-column: ${(props) => props.gC};
  padding: ${(props) => props.pad && props.pad + 'em'};
  overflow: hidden;
`

export const FlexCenteredItem = styled(Item)`
  justify-content: center;
`
export const Text = styled.div`
  display: block;
`
export const InlineText = styled(Text)`
  display: inline;
`
export const BoldInlineText = styled(InlineText)`
  font-weight: bold;
  text-align: left;
`
export const BigBoldInlineText = styled(BoldInlineText)`
  font-size: 1.3em;
`