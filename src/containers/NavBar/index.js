import React, { Component } from 'react'
import styled from 'styled-components'
import NavLink from './NavLink'

const NavBar = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 5px;
  padding: 1.5em;
  background-color: white;
`

class Nav extends Component {
  render() {
    return (
      <NavBar>
        <NavLink strict to="/">
          Home
        </NavLink>
      </NavBar>
    )
  }
}

export default Nav
