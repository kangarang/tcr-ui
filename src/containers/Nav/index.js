import React, { Component } from 'react'
import styled from 'styled-components'
import NavLink from './NavLink'
import { colors } from '../../components/Colors'

const NavBar = styled.div`
  align-self: flex-end;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 5px;
  width: 60vw;
  padding: 1.5em;
`
const styles = {
  active: {
    fontWeight: 'bold',
    color: 'red',
  },
}

class Nav extends Component {
  render() {
    return (
      <NavBar>
        <NavLink to="/"></NavLink>
        <NavLink strict to="/">
          Home
        </NavLink>
        <NavLink activeStyle={styles.active} to="/challenge">
          Challenge
        </NavLink>
        <NavLink activeStyle={styles.active} to="/vote">
          Vote
        </NavLink>
        <NavLink activeStyle={styles.active} to="/search">
          Registry
        </NavLink>
      </NavBar>
    )
  }
}

export default Nav
