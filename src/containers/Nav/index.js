import React, { Component } from 'react'
import NavLink from './NavLink'

class Nav extends Component {
  render() {
    return (
      <div>
        <NavLink to='/home'>Home</NavLink>
        <NavLink to='/apply'>Apply</NavLink>
        <NavLink to='/challenge'>Challenge</NavLink>
        <NavLink to='/vote'>Vote</NavLink>
        <NavLink to='/activities'>Activities</NavLink>
        <NavLink to='/search'>Search</NavLink>
      </div>
    )
  }
}

export default Nav
