import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { colors } from '../../global-styles'

const NavLinkWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  & > a {
    text-decoration: none;
    color: ${colors.darkBlue};
    font-weight: bold;
  }
`

export default props => (
  <NavLinkWrapper>
    <NavLink activeClassName="selected" {...props} />
  </NavLinkWrapper>
)
