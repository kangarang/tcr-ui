import React, { Component } from 'react'
import Stepper, { Step, StepLabel, StepContent } from 'material-ui/Stepper'
import { withStyles } from 'material-ui'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'

import { baseToConvertedUnit } from 'redux/libs/units'
import translate from 'views/translations'
import { colors } from 'views/global-styles'
import { MarginDiv } from 'views/components/StyledHome'
import Img from 'views/components/Img'
import Button from 'views/components/Button'
import Text from 'views/components/Text'

import { SideSplit, SideText, SideTextInput } from './components'
import SidePanelSeparator from './components/SidePanelSeparator'
import SidePanel from './components/SidePanel'

const styles = theme => ({
  root: {
    width: '90%',
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
})

function getSteps() {
  return [
    'Choose your side',
    'Request voting rights',
    'Commit tokens',
    'Save commit file',
  ]
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`
    case 1:
      return 'In order to send transactions for voting, you must first Transfer tokens to the voting contract'
    case 2:
      return `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`
    case 3:
      return 'An ad group contains one or more ads which target a shared set of keywords.'
    default:
      return 'Unknown step'
  }
}

class CommitVote extends Component {
  state = {
    commitHash: '',
    numTokens: '',
    activeStep: 0,
  }
  componentDidMount() {
    this.getCommitHash()
  }

  getCommitHash = async () => {
    const numTokensRaw = (await this.props.voting.getNumTokens(
      this.props.account,
      this.props.selectedOne.get('challengeID')
    ))['0']
    const commitHash = (await this.props.voting.getCommitHash(
      this.props.account,
      this.props.selectedOne.get('challengeID')
    ))['0']
    const numTokens = baseToConvertedUnit(
      numTokensRaw,
      this.props.tcr.get('tokenDecimals')
    )
    if (
      commitHash !== '0x0000000000000000000000000000000000000000000000000000000000000000'
    ) {
      this.setState({
        commitHash,
        numTokens,
      })
    }
  }
  handleNext = () => {
    this.setState({
      activeStep: this.state.activeStep + 1,
    })
  }

  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1,
    })
  }

  handleReset = () => {
    this.setState({
      activeStep: 0,
    })
  }

  render() {
    const {
      opened,
      closeSidePanel,
      balances,
      selectedOne,
      handleInputChange,
      handleApprove,
      handleCommitVote,
      handleRequestVotingRights,
      needToApprove,
      classes,
    } = this.props
    const steps = getSteps()
    const { activeStep } = this.state
    return (
      <div>
        <SidePanel title="Commit Vote" opened={opened} onClose={closeSidePanel}>
          {/* <Img alt="" src={selectedOne.getIn(['tokenData', 'imgSrc'])} /> */}
          <SideText
            size="large"
            small
            text={
              selectedOne &&
              `${selectedOne.getIn(['tokenData', 'name'])} (${selectedOne.getIn([
                'tokenData',
                'symbol',
              ])})`
            }
          />

          <SidePanelSeparator />

          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => {
              return (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    <Typography>{getStepContent(index)}</Typography>

                    {index === 0 && (
                      <div className={classes.actionsContainer}>
                        <Button onClick={e => handleCommitVote('1')}>
                          {'Support the applicant'}
                        </Button>
                        <Button
                          onClick={e => handleCommitVote('0')}
                          bgColor={colors.darkRed}
                          fgColor={'white'}
                        >
                          {'Oppose the applicant'}
                        </Button>
                      </div>
                    )}
                    {index === 1 && (
                      <div className={classes.actionsContainer}>
                        <Button onClick={handleRequestVotingRights} mode="strong" wide>
                          {'Request Voting Rights'}
                        </Button>
                      </div>
                    )}
                    {index === 2 && (
                      <div className={classes.actionsContainer}>
                        <SideTextInput
                          title="token amount"
                          type="number"
                          handleInputChange={e => handleInputChange(e, 'numTokens')}
                        />
                      </div>
                    )}
                    {index === 3 && (
                      <div className={classes.actionsContainer}>
                        <Button onClick={handleRequestVotingRights} mode="strong" wide>
                          {'Download commit'}
                        </Button>
                      </div>
                    )}
                    <div className={classes.actionsContainer}>
                      <div>
                        {activeStep !== steps.length - 1 && (
                          <Button
                            disabled={activeStep === 0}
                            onClick={this.handleBack}
                            className={classes.button}
                          >
                            Back
                          </Button>
                        )}
                        <Button
                          variant="raised"
                          color="primary"
                          onClick={this.handleNext}
                          className={classes.button}
                        >
                          {activeStep === steps.length - 1 ? 'Commit vote' : 'Next'}
                        </Button>
                      </div>
                    </div>
                  </StepContent>
                </Step>
              )
            })}
          </Stepper>
          {activeStep === steps.length && (
            <Paper square elevation={0} className={classes.resetContainer}>
              <Typography>All steps completed - you&quot;re finished</Typography>
              <Button onClick={this.handleReset} className={classes.button}>
                Reset
              </Button>
            </Paper>
          )}

          <MarginDiv>
            <Button onClick={handleRequestVotingRights} mode="strong" wide>
              {'Request Voting Rights'}
            </Button>
            <Button onClick={e => handleApprove('voting')} mode="strong" wide>
              {'Approve tokens for Voting'}
            </Button>
          </MarginDiv>
        </SidePanel>
      </div>
    )
  }
}

export default withStyles(styles)(CommitVote)
