import React, { Component } from 'react'

export const StepperContext = React.createContext()
// const {Provider, Consumer} = React.createContext(defaultValue);

class StepperProvider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stage: 1,
    }
  }
  render() {
    return (
      <StepperContext.Provider
        value={{
          stage: this.state.stage,
          handleClick: () =>
            this.setState({
              stage: this.state.stage + 1,
            }),
        }}
      >
        {this.props.children}
      </StepperContext.Provider>
    )
  }
}

export default StepperProvider
