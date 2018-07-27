import React from 'react'

class Radio extends React.Component {
  render() {
    const { checked, handleCheckRadio, ...props } = this.props
    return (
      <div>
        <input type="radio" checked={checked} onChange={handleCheckRadio} {...props} />
      </div>
    )
  }
}

export default Radio
