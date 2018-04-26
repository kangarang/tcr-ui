import React, { Component } from 'react'
import styled from 'styled-components'

import NavLink from './NavLink'

const Nav = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 5px;
  padding: 1.5em;
  background-color: white;
`

class NavBar extends Component {
  render() {
    return (
      <Nav>
        <NavLink strict to="/" />
        <NavLink strict to="/">
          Home
        </NavLink>
        <NavLink strict to="/" />
        <NavLink strict to="/">
          Activities
        </NavLink>
      </Nav>
    )
  }
}

export default NavBar
