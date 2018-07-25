import React from 'react'
import styled from 'styled-components'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import CommitVote from 'containers/Transactions/CommitVote'
import StepperProvider from 'containers/Stepper/StepperProvider'
import Stepper from 'components/Stepper'

const StepperContainer = styled.div`
  display: flex;
  flex-direction: column;
`

storiesOf('Transactions', module).add('Stepper', props => (
  <StepperContainer>{props.children}</StepperContainer>
))

const selectedOne = {
  listingData: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Sunset_2007-1.jpg',
  listingID: 'FRESH',
}
// storiesOf('Transactions', module).add('Commit Vote', () => (
//   <CommitVote selectedOne={selectedOne}></CommitVote>
// ))

// const Step = ({ num, text, stage }) =>
//   stage === num ? (
//     <div key={num} style={styles.stageContent}>
//       {text}
//     </div>
//   ) : null

export const Step = ({ num, text }) => (
  <StepperContext.Consumer>
    {value => {
      const { stage } = value
      return stage === num ? (
        <div key={num} style={styles.stageContent}>
          {text}
        </div>
      ) : null
    }}
  </StepperContext.Consumer>
)

class RootComponent extends Component {
  render() {
    return (
      <StepperProvider>
        <Stepper stage={1}>
          <Stepper.Progress>
            <Stepper.Stage num={1} />
            <Stepper.Stage num={2} />
            <Stepper.Stage num={3} />
            <Stepper.Stage num={4} />
          </Stepper.Progress>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Stepper.Header title="Stepper Heading" />
            <Stepper.Steps>
              <Stepper.Step num={1} text={'Stage 1'} />
              <Stepper.Step num={2} text={'Stage 2'} />
              <Stepper.Step num={3} text={'Stage 3'} />
              <Stepper.Step num={4} text={'Stage 4'} />
            </Stepper.Steps>
          </div>
        </Stepper>
      </StepperProvider>
    )
  }
}

storiesOf('Transactions', module).add('Context Stepper', () => (
  <RootComponent selectedOne={selectedOne} />
))
