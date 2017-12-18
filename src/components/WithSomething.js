import React from 'react'

export const WithSomething = (BaseComponent) => class extends React.Component {
  render() {
    return (
      <BaseComponent {...this.props} />
    )
  }
}