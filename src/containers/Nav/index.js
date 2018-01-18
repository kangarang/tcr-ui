import React, { Component } from 'react'
import styled from 'styled-components'
import NavLink from './NavLink'

const NavBar = styled.div`
  align-self: flex-end;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 5px;
  width: 60vw;
  padding: 1.5em;
`

class Nav extends Component {
  render() {
    return (
      <NavBar>
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/apply'>Apply</NavLink>
        <NavLink to='/challenge'>Challenge</NavLink>
        <NavLink to='/vote'>Vote</NavLink>
        <NavLink to='/activities'>Activities</NavLink>
        <NavLink to='/search'>Search</NavLink>
      </NavBar>
    )
  }
}

export default Nav
