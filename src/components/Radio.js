import React from 'react'

class Radio extends React.Component {
  render() {
    const { on, handleCheckRadio, ...props } = this.props
    return (
      <div>
        <input type="radio" checked={on} onChange={handleCheckRadio} {...props} />
      </div>
    )
  }
}

export default Radio
