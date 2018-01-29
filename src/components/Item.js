import styled from 'styled-components'
import { colors } from './Colors'

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 6fr 6fr 4fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  margin: 1em;
  padding: .7em;
  background-color: rgba(0, 0, 0, 0.1);
  color: ${colors.offBlack};
  border: 2px solid ${colors.prism};
  border-radius: 4px;
  box-shadow: 0px 2px 4px rgba(0,0,0,0.18);
`
export const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  grid-row: ${(props) => props.gR};
  grid-column: ${(props) => props.gC};
  /* padding: ${(props) => props.pad && props.pad + 'em'}; */
  overflow: hidden;
  text-overflow: ellipsis;
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
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 1em;
`
export const BigBoldInlineText = styled(BoldInlineText)`
  font-size: 1.3em;
`