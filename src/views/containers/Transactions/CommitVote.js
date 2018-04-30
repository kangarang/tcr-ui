import React, { Component } from 'react'
import Stepper, { Step, StepLabel, StepContent } from 'material-ui/Stepper'
import { withStyles } from 'material-ui'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import Radio from 'material-ui/Radio'
import green from 'material-ui/colors/green'

import { baseToConvertedUnit, BN } from 'redux/libs/units'
import { getVoteSaltHash, randInt } from 'redux/libs/values'
import { getEndDateString } from 'redux/utils/_datetime'
import saveFile from 'redux/utils/_file'

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
    color: green[600],
    '&$checked': {
      color: green[500],
    },
  },
  checked: {},
  button: {},
  actionsContainer: {
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit,
  },
  stepper: {
    background: `${colors.lightBg}`,
    padding: '1em',
  },
})

function getSteps() {
  return [
    'Choose your side',
    'Request voting rights',
    'Commit tokens',
    'Save secret vote file',
    'Send transaction',
  ]
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return ''
    case 1:
      return 'Approve the transaction to allow the voting smart contract to transfer tokens from your account'
    case 2:
      return 'Please enter the amount of tokens you wish to commit to your vote'
    case 3:
      return 'Hold onto this file. You will need it to reveal your secret vote'
    case 4:
      return 'Please remember to reveal your vote'
    default:
      return 'Unknown step'
  }
}

class CommitVote extends Component {
  state = {
    commitHash: '',
    numTokens: '',
    activeStep: 0,
    selectedValue: '',
    salt: randInt(1e6, 1e9),
  }
  componentDidMount() {
    // this.getCommitHash()
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
  handleNext = num => {
    if (BN(this.props.balances.get('votingRights')).gt(0) && typeof num === 'number') {
      this.setState({
        activeStep: this.state.activeStep + num,
      })
    } else {
      this.setState({
        activeStep: this.state.activeStep + 1,
      })
    }
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
  handleChange = event => {
    this.setState({ selectedValue: event.target.value })
    this.handleNext(2)
  }
  handleChangeSalt = event => {
    this.setState({
      salt: event.target.value,
    })
  }
  handleSaveFile = () => {
    const commitEndDate = this.props.selectedOne.getIn(['commitExpiry', 'timestamp'])
    const revealEndDate = this.props.selectedOne.getIn(['revealExpiry', 'timestamp'])

    // // record expiry dates
    const commitEndDateString = getEndDateString(commitEndDate)
    const revealEndDateString = getEndDateString(revealEndDate)
    const salt = this.state.salt.toString(10)
    const voteOption = this.state.selectedValue
    const pollID = this.props.selectedOne.get('challengeID')
    const listingID = this.props.selectedOne.get('listingID')

    const secretHash = getVoteSaltHash(voteOption, salt)
    const json = {
      voteOption,
      numTokens: this.props.numTokens,
      commitEnd: commitEndDateString,
      revealEnd: revealEndDateString,
      listingID,
      salt,
      pollID,
      secretHash,
      account: this.props.account,
    }
    const yon = voteOption === '1' ? 'for' : 'against'
    // const listingDashed = data.replace(' ', '-')
    const filename = `${pollID}-${yon}-${listingID}.json`

    // TODO: local storag
    const file = saveFile(json, filename)
    if (file.size) {
      this.handleNext()
    }
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
      <div className={classes.root}>
        <SidePanel title="Commit Vote" opened={opened} onClose={closeSidePanel}>
          <SidePanelSeparator />
          {/* <Img alt="" src={selectedOne.getIn(['tokenData', 'imgSrc'])} /> */}
          <SideText
            size="medium"
            text={
              selectedOne &&
              `${selectedOne.getIn(['tokenData', 'name'])} (${selectedOne.getIn([
                'tokenData',
                'symbol',
              ])}) ${
                this.state.selectedValue === '0'
                  ? '- AGAINST'
                  : this.state.selectedValue === '1' ? '- SUPPORT' : ''
              }`
            }
          />

          <Stepper
            className={classes.stepper}
            activeStep={activeStep}
            orientation="vertical"
          >
            {steps.map((label, index) => {
              return (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    <Typography>{getStepContent(index)}</Typography>

                    {index === 0 && (
                      <div className={classes.actionsContainer}>
                        <div>
                          <Radio
                            checked={this.state.selectedValue === '1'}
                            onChange={this.handleChange}
                            value="1"
                            name="radio-button-demo"
                            aria-label="FOR"
                            classes={{
                              root: classes.root,
                              checked: classes.checked,
                            }}
                          />
                          <Text size="large">{'Support'}</Text>
                        </div>
                        <div>
                          <Radio
                            checked={this.state.selectedValue === '0'}
                            onChange={this.handleChange}
                            value="0"
                            name="radio-button-demo"
                            aria-label="AGAINST"
                          />
                          <Text size="large">{'Oppose'}</Text>
                        </div>
                      </div>
                    )}
                    {index === 1 && (
                      <div className={classes.actionsContainer}>
                        <SideTextInput
                          title="token amount"
                          type="number"
                          handleInputChange={e => handleInputChange(e, 'numTokens')}
                        />
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
                        <SideTextInput
                          title="salt"
                          type="number"
                          handleInputChange={e => this.handleChangeSalt(e)}
                          value={this.state.salt}
                        />
                        <Button onClick={this.handleSaveFile} mode="strong" wide>
                          {'Download commit'}
                        </Button>
                      </div>
                    )}
                    {index === 4 && (
                      <div className={classes.actionsContainer}>
                        <Button
                          onClick={e =>
                            handleCommitVote(this.state.selectedValue, this.state.salt)
                          }
                          mode="strong"
                          wide
                        >
                          {'Send Transaction'}
                        </Button>
                      </div>
                    )}
                    <div className={classes.actionsContainer}>
                      <div>
                        <Button
                          disabled={activeStep === 0}
                          onClick={this.handleBack}
                          className={classes.button}
                        >
                          {'Back'}
                        </Button>
                        {activeStep !== 0 &&
                          activeStep !== 3 &&
                          activeStep !== 4 && (
                            <Button
                              variant="raised"
                              color="primary"
                              onClick={this.handleNext}
                              className={classes.button}
                            >
                              {'Next'}
                            </Button>
                          )}
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
        </SidePanel>
      </div>
    )
  }
}

export default withStyles(styles)(CommitVote)
