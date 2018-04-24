import React, { Children } from 'react'
import PropTypes from 'prop-types'

import A from './A'
import StyledButton from './StyledButton'
import Wrapper from './Wrapper'

function Button(props) {
  // Render an anchor tag
  let button = (
    <A href={props.href} target="_blank" onClick={props.onClick} {...props}>
      {Children.toArray(props.children)}
    </A>
  )

  if (props.disabled) {
    button = (
      <StyledButton onClick={props.onClick} {...props}>
        {Children.toArray(props.children)}
      </StyledButton>
    )
  }

  // If the Button has a handleRoute prop, we want to render a button
  if (props.handleRoute) {
    button = (
      <StyledButton onClick={props.handleRoute}>
        {Children.toArray(props.children)}
      </StyledButton>
    )
  }

  return <Wrapper>{button}</Wrapper>
}

Button.propTypes = {
  handleRoute: PropTypes.func,
  href: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
}

export default Button
