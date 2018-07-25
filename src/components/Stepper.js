import React, { Component } from 'react'
import styled from 'styled-components'
import { StepperContext } from 'containers/Home'

import {
  selectError,
  selectAccount,
  selectNetwork,
  selectBalances,
  selectTCR,
} from 'modules/home/selectors'

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4.5em;
  background-color: white;
  font-family: 'Avenir Next';
`

function Step() {
  return (
    <StepperContext.Consumer>
      {value => {
        const { stage } = value
        return <div>{stage}</div>
      }}
    </StepperContext.Consumer>
  )
}
class Steps extends Component {
  render() {
    return (
      <StepperContext.Consumer>
        {context => {
          const { stage, handleClick } = context
          return (
            <div>
              <div>{this.props.children}</div>
              <div>{stage}</div>
              <div>
                <button onClick={handleClick}>BUTT</button>
              </div>
            </div>
          )
        }}
      </StepperContext.Consumer>
    )
  }
}

class Stepper extends Component {
  static Steps = Steps
  static Step = Step

  render() {
    return <HeaderWrapper>{this.props.children}</HeaderWrapper>
  }
}

export default Stepper
