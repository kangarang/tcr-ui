import React, { Component } from 'react'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Radio from '@material-ui/core/Radio'
import green from '@material-ui/core/colors/green'

import { baseToConvertedUnit } from 'libs/units'
import { getVoteSaltHash, randomSalt } from 'libs/values'
import { getEndDateString } from 'utils/_datetime'
import saveFile from 'utils/_file'

import { colors } from 'global-styles'
import Button from 'components/Button'
import Text from 'components/Text'
import Img from 'components/Img'

import { SideText, SideTextInput } from './components'
import SidePanelSeparator from './components/SidePanelSeparator'
import SidePanel from './components/SidePanel'
import styled from 'styled-components'

const styles = theme => ({
  root: {
    color: green[600],
    '&$checked': {
      color: green[500],
    },
  },
  checked: {},
  actionsContainer: {
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit * 2,
    color: `${colors.darkGrey}`,
  },
  resetContainer: {
    padding: theme.spacing.unit,
  },
  stepper: {
    background: `${colors.lightBg}`,
    padding: '1em',
  },
})

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
    salt: randomSalt(),
    choice: '',
  }
  componentDidMount() {
    this.getCommitHash()
  }

  getCommitHash = async () => {
    console.log('this.props:', this.props)
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

  getSteps = () => {
    return [
      'Choose your side',
      'Approve Voting contract',
      'Commit tokens',
      'Download secret vote file',
      'Send transaction',
    ]
  }
  handleNext = num => {
    if (
      this.props.balances.get('votingRights') === '0.0' ||
      this.props.balances.get('votingAllowance') === '0.0' ||
      typeof num !== 'number'
    ) {
      this.setState({
        activeStep: this.state.activeStep + 1,
      })
    } else {
      this.setState({
        activeStep: this.state.activeStep + num,
      })
    }
  }
  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1,
    })
  }
  handleClickStepLabel = (e, index) => {
    e.preventDefault()
    if (index < this.state.activeStep) {
      this.setState({
        activeStep: index,
      })
    }
  }
  handleReset = () => {
    this.setState({
      activeStep: 0,
    })
  }
  handleChange = event => {
    const choice =
      event.target.value === '0'
        ? '- Oppose'
        : event.target.value === '1' ? '- Support' : ''
    this.setState({ selectedValue: event.target.value, choice })
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

    // record expiry dates
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
      selectedOne,
      handleInputChange,
      handleCommitVote,
      handleApprove,
      needToApprove,
      classes,
    } = this.props
    const stepps = [
      <div className={classes.actionsContainer}>
        <div>
          <Radio
            checked={this.state.selectedValue === '1'}
            onClick={this.handleChange}
            value="1"
            name="radio-button-demo"
            aria-label="FOR"
          />
          <Text size="large">{'Support'}</Text>
        </div>
        <div>
          <Radio
            checked={this.state.selectedValue === '0'}
            onClick={this.handleChange}
            value="0"
            name="radio-button-demo"
            aria-label="AGAINST"
          />
          <Text size="large">{'Oppose'}</Text>
        </div>
      </div>,
      <div className={classes.actionsContainer}>
        <div>{`Voting allowance: ${this.props.balances.get('votingAllowance')}`}</div>
        <div>{`Voting rights: ${this.props.balances.get('votingRights')}`}</div>
        <SideTextInput
          title="token amount"
          type="number"
          handleInputChange={e => handleInputChange(e, 'numTokens')}
        />
        {needToApprove && (
          <div>
            <Button
              methodName="approve"
              onClick={e => handleApprove('voting')}
              mode="strong"
              wide
            >
              {'Approve Voting contract'}
            </Button>
          </div>
        )}
      </div>,
      <div className={classes.actionsContainer}>
        <div>{`Voting allowance: ${this.props.balances.get('votingAllowance')}`}</div>
        <div>{`Voting rights: ${this.props.balances.get('votingRights')}`}</div>
        <SideTextInput
          title="token amount"
          type="number"
          handleInputChange={e => handleInputChange(e, 'numTokens')}
        />
      </div>,
      <div className={classes.actionsContainer}>
        <SideTextInput
          title="salt"
          type="text"
          handleInputChange={e => this.handleChangeSalt(e)}
          value={this.state.salt}
        />
        <Button methodName="download" onClick={this.handleSaveFile} mode="strong" wide>
          {'Download commit'}
        </Button>
      </div>,
      <div className={classes.actionsContainer}>
        <Button
          onClick={e => handleCommitVote(this.state.selectedValue, this.state.salt)}
          mode="strong"
          wide
          methodName="commitVote"
        >
          {'Send Transaction'}
        </Button>
      </div>,
    ]
    const steps = this.getSteps()
    const { activeStep } = this.state
    return (
      <div className={classes.root}>
        <SidePanel title="Commit Vote" opened={opened} onClose={closeSidePanel}>
          <SidePanelSeparator />

          <FlexContainer>
            {selectedOne.hasIn(['tokenData', 'imgSrc']) && (
              <IconWrapper>
                <Img
                  src={
                    selectedOne &&
                    selectedOne.hasIn(['tokenData', 'imgSrc']) &&
                    selectedOne.getIn(['tokenData', 'imgSrc'])
                  }
                  alt=""
                />
              </IconWrapper>
            )}
            <SideText
              size="medium"
              text={
                selectedOne &&
                `${selectedOne.getIn(['tokenData', 'name']) ||
                  selectedOne.get('listingID')} ${this.state.choice}`
              }
            />
          </FlexContainer>

          <Stepper
            className={classes.stepper}
            activeStep={activeStep}
            orientation="vertical"
          >
            {steps.map((label, index) => {
              return (
                <Step key={label}>
                  <StepLabel
                    onClick={e => this.handleClickStepLabel(e, index)}
                    classes={{
                      iconContainer: classes.iconContainer,
                      label: classes.label,
                    }}
                  >
                    {label}
                  </StepLabel>
                  <StepContent>
                    <Typography>{getStepContent(index)}</Typography>

                    <div className={classes.actionsContainer}>
                      {stepps[index]}
                      {activeStep !== 0 && (
                        <Button
                          disabled={activeStep === 0}
                          onClick={this.handleBack}
                          className={classes.button}
                          methodName="back"
                        >
                          {'Back'}
                        </Button>
                      )}
                      {activeStep !== 0 &&
                        activeStep !== 3 &&
                        activeStep !== 4 && (
                          <Button
                            variant="raised"
                            color="primary"
                            onClick={this.handleNext}
                            className={classes.button}
                            methodName="next"
                          >
                            {'Next'}
                          </Button>
                        )}
                    </div>
                  </StepContent>
                </Step>
              )
            })}
          </Stepper>
        </SidePanel>
      </div>
    )
  }
}
const FlexContainer = styled.div`
  display: flex;
`
const IconWrapper = styled.div`
  display: flex;
  height: 80px;
  width: 80px;
  margin: 10px;
`

export default withStyles(styles)(CommitVote)
