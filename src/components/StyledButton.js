import React, { Children } from 'react'
import styled, { css } from 'styled-components'
import { colors } from '../../../components/Colors'

const buttonStyles = css`
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  outline: 0;

  text-decoration: none;
  user-select: none;
  cursor: pointer;

  font-size: 1em;
  font-weight: bold;

  color: ${colors.magenta};
  background-color: ${colors.greyBg};
  border: 2px solid ${colors.purple};
  border-radius: 4px;
  overflow: hidden;
`
const A = styled.a`
  ${buttonStyles};
`

const StyledButton = styled.button`
  ${buttonStyles};
`

const Wrapper = styled.div`
  display: inline-block;
  text-align: center;
  margin: 0.4em;
`

function StyledButton(props) {
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

  return <Wrapper>{button}</Wrapper>
}

export default StyledButton
