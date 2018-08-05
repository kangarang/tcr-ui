import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Button from 'components/Button'

class Landing extends Component {
  render() {
    const style = {
      margin: '10px 5px 20px 20px',
    }

    const h1Style = {
      fontSize: '150px',
      lineHeight: '120px',
      fontWeight: 'bold',
      marginTop: '60px',
      marginBottom: '60px',
    }

    const buttonStyle = {
      width: '600px',
      height: '100px',
      backgroundColor: 'salmon',
      verticalAlign: 'middle',
      textAlign: 'left',
      color: '#FFFFFF',
      display: 'inline-flex',
      alignItems: 'center',
      textDecoration: 'wavy',
    }

    const pStyle = {
      margin: '10px 5px 20px 10px',
      fontSize: '10px',
      position: 'absolute',
      bottom: '5px',
    }

    return (
      <div style={style}>
        <p style={h1Style}>
          {' '}
          the humans <br /> registry{' '}
        </p>
        <Link to="/registries">
          {' '}
          <Button style={buttonStyle}>Proove your humanity ⟶</Button>
        </Link>
        <p style={pStyle}>
          {' '}
          Created by David Terry & Achill Rudolph © 2018. TCR UI by Kangarang. TCR
          contracts by Mike Goldin. Terms and conditions.
        </p>
      </div>
    )
  }
}

export default Landing
