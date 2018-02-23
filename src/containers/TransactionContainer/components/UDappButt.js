import React, { Children } from 'react'
import styled from 'styled-components'
import { colors } from '../../../components/Colors'
import buttonStyles from './styles'

const A = styled.a`${buttonStyles}`

const StyledButton = styled.button`${buttonStyles}`

const Wrapper = styled.div`
  display: inline-block;
  text-align: center;
  margin: 0.4em;
`

function UDappButt(props) {
  // Render an anchor tag
  let button = (
    <A href={props.href} onClick={props.onClick}>
      {Children.toArray(props.children)}
    </A>
  )

  // If the UDappButt has a handleRoute prop, we want to render a button
  if (props.handleRoute) {
    button = (
      <StyledButton onClick={props.handleRoute}>
        {Children.toArray(props.children)}
      </StyledButton>
    )
  }

  return (
    <Wrapper>
      {button}
    </Wrapper>
  )
}

export default UDappButt 
