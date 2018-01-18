import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { colors } from '../../components/Colors';

const NavLink = styled.div`
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
  <NavLink>
    <Link {...props} />
  </NavLink>
)
