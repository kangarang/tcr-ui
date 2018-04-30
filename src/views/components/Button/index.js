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

  return <Wrapper>{button}</Wrapper>
}

Button.propTypes = {
  href: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
}

export default Button
