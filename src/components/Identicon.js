import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import Jazzicon from 'jazzicon'

class Identicon extends Component {
  constructor(props) {
    super(props);
    this.defaultDiameter = 46
  }

  componentDidMount() {
    const { address } = this.props

    if (!address) return

    var container = findDOMNode(this)

    var diameter = this.props.diameter || this.defaultDiameter
    var img = this.generateNewIdenticon(address, diameter)
    container.appendChild(img)
  }

  jsNumberForAddress(address) {
    var addr = address.slice(2, 10)
    var seed = parseInt(addr, 16)
    return seed
  }

  generateNewIdenticon(address, diameter) {
    var numericRepresentation = this.jsNumberForAddress(address)
    var identicon = Jazzicon(diameter, numericRepresentation)
    return identicon
  }

  componentDidUpdate() {
    const { address } = this.props

    if (!address) return

    var container = findDOMNode(this)

    var children = container.children
    for (var i = 0; i < children.length; i++) {
      container.removeChild(children[i])
    }

    var diameter = this.props.diameter || this.defaultDiameter
    var img = this.generateNewIdenticon(address, diameter)
    container.appendChild(img)
  }

  render() {
    var diameter = this.props.diameter || this.defaultDiameter
    var style = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: diameter,
      width: diameter,
      borderRadius: diameter / 2,
      overflow: 'hidden',
    }

    return <div key={'identicon-' + this.props.address} style={style} />
  }
}

export default Identicon