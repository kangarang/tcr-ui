import React, { Component } from 'react'

import Button from 'components/Button'
import Img from 'components/Img'
import SidePanelSeparator from './components/SidePanelSeparator'
import SidePanel from './components/SidePanel'
import styled from 'styled-components'

import { getVoteSaltHash, randomSalt } from 'libs/values'
import { getEndDateString } from 'utils/_datetime'
import leftArrowIconSrc from 'assets/icons/left-arrow.svg'
// import rightArrowIconSrc from 'assets/icons/right-arrow-thin.svg'
// import thumbsUpIconSrc from 'assets/icons/thumbs-up.svg'
import thumbsDownIconSrc from 'assets/icons/thumbs-down.svg'
import likeIconSrc from 'assets/icons/like.svg'
import { getLocal, saveLocal } from '../../utils/_localStorage'
// import dislikeIconSrc from 'assets/icons/dislike.svg'

const SidePanelWrapper = styled.div`
  font-family: 'Avenir Next';
`
const DetailsSection = styled.div`
  display: flex;
  padding: 2em 0;
`
const ListingIconSquare = styled.div`
  height: 90px;
  width: 90px;
  border: 1px solid black;
`
const ListingInfoColumn = styled.div`
  margin-left: 1em;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: 1.2em;
`
const ListingTitle = styled.div`
  font-weight: 600;
`
const ListingCountdown = styled.div`
  color: #fb8414;
  font-weight: 500;
`

const ActionsSection = styled.div`
  display: flex;
  flex-direction: column;
`
const ActionStepRow = styled.div`
  margin-top: 2em;
`
const ActionTitle = styled.div`
  margin-left: 1em;
  font-weight: 550;
`
const ActionInstructions = styled.div`
  padding: 1.2em 1.5em;
  color: #788995;
`
const SupportCandidate = styled.div`
  display: flex;
  box-sizing: border-box;
  padding: 0.8em 2em;
  margin: 10px 0;
  border: 1px solid #dde3e8;
  border-radius: 3px;
  background-color: #ffffff;
  font-size: 1.25em;
`
const OpposeCandidate = SupportCandidate.extend``
const ThumbIcon = styled.div`
  width: 20px;
  margin-left: 8em;
  & > div > img {
    background-color: black;
  }
`
const InputFormRow = styled.div`
  display: flex;
  box-sizing: border-box;
  background-color: #ffffff;
`
const InputNumTokens = styled.input`
  width: 80%;
  padding: 0.8em 1.2em;
  font-size: 1em;
  border: 1px solid #71b6ef;
  border-right: 1px solid #dde3e8;
  border-radius: 3px 0 0 3px;
`
const SubmitButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  padding: 1.2em 2em;
  color: #71b6ef;
  border: 1px solid #71b6ef;
  border-left: none;
  border-radius: 0 3px 3px 0;
  font-size: 0.9em;
  font-weight: 700;
`
const DownloadTicket = styled.div``
const ReturnToRegistry = styled.div`
  display: flex;
  margin-top: 1em;
`
const ArrowIcon = styled.div`
  width: 20px;
  margin-right: 5px;
`
class CommitVote extends Component {
  state = {
    commitHash: '',
    numTokens: '',
    activeStep: 0,
    selectedValue: '',
    salt: randomSalt(),
    choice: '',
  }
  // componentDidMount() {
  //   this.getCommitHash()
  // }

  // getCommitHash = async () => {
  //   console.log('this.props:', this.props)
  //   const numTokensRaw = (await this.props.voting.getNumTokens(
  //     this.props.account,
  //     this.props.selectedOne.challengeID
  //   ))['0']
  //   const commitHash = (await this.props.voting.getCommitHash(
  //     this.props.account,
  //     this.props.selectedOne.challengeID
  //   ))['0']
  //   const numTokens = baseToConvertedUnit(numTokensRaw, this.props.tcr.tokenDecimals)
  //   if (
  //     commitHash !== '0x0000000000000000000000000000000000000000000000000000000000000000'
  //   ) {
  //     this.setState({
  //       commitHash,
  //       numTokens,
  //     })
  //   }
  // }

  // getSteps = () => {
  //   return [
  //     'Choose your side',
  //     'Approve Voting contract',
  //     'Commit tokens',
  //     'Download secret vote file',
  //     'Send transaction',
  //   ]
  // }
  // handleNext = num => {
  //   if (
  //     this.props.balances.votingRights === '0.0' ||
  //     this.props.balances.votingAllowance === '0.0' ||
  //     typeof num !== 'number'
  //   ) {
  //     this.setState({
  //       activeStep: this.state.activeStep + 1,
  //     })
  //   } else {
  //     this.setState({
  //       activeStep: this.state.activeStep + num,
  //     })
  //   }
  // }
  // handleBack = () => {
  //   this.setState({
  //     activeStep: this.state.activeStep - 1,
  //   })
  // }
  // handleClickStepLabel = (e, index) => {
  //   e.preventDefault()
  //   if (index < this.state.activeStep) {
  //     this.setState({
  //       activeStep: index,
  //     })
  //   }
  // }
  // handleReset = () => {
  //   this.setState({
  //     activeStep: 0,
  //   })
  // }
  // handleChange = event => {
  //   const choice =
  //     event.target.value === '0'
  //       ? '- Oppose'
  //       : event.target.value === '1' ? '- Support' : ''
  //   this.setState({ selectedValue: event.target.value, choice })
  //   this.handleNext(2)
  // }
  // handleChangeSalt = event => {
  //   this.setState({
  //     salt: event.target.value,
  //   })
  // }
  handleSaveFile = async () => {
    const commitEndDate = this.props.selectedOne.commitExpiry.timestamp
    const revealEndDate = this.props.selectedOne.revealExpiry.timestamp

    // record expiry dates
    const commitEndDateString = getEndDateString(commitEndDate)
    const revealEndDateString = getEndDateString(revealEndDate)
    const salt = this.state.salt.toString(10)
    // const voteOption = this.state.selectedValue
    const voteOption = '1'
    const pollID = this.props.selectedOne.challengeID
    const listingID = this.props.selectedOne.listingID

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
    // const yon = voteOption === '1' ? 'for' : 'against'
    // const listingDashed = data.replace(' ', '-')
    // const filename = `${pollID}-${yon}-${listingID}.json`

    const key = `${pollID}-${listingID}`
    const local = await getLocal(key)
    if (!local) {
      const file = await saveLocal(key, json)
      // const file = saveFile(json, filename)
      // this.handleNext()
      this.props.handleCommitVote('1', this.state.salt)
    } else {
      console.log('theres a file saved locally')
    }
  }

  // handleSubmitCommitTokens = () => {
  //   this.props.handleCommitVote(this.props.numTokens, this.state.salt)
  // }

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
    return (
      <SidePanelWrapper>
        <SidePanel title="Commit Your Vote" opened={true} onClose={closeSidePanel}>
          {/* <ArrowIcon>
            <Img src={rightArrowIconSrc} />
          </ArrowIcon> */}
          <SidePanelSeparator />

          <DetailsSection>
            <ListingIconSquare>
              {/* <IconWrapper>
                <Img src={selectedOne.listingData.imgSrc} alt="" />
              </IconWrapper> */}
            </ListingIconSquare>

            <ListingInfoColumn>
              <ListingTitle>ABC.COM</ListingTitle>

              <ListingCountdown>
                <div>Vote Ends In</div>
                <div>00 : 20 : 00</div>
              </ListingCountdown>
            </ListingInfoColumn>
          </DetailsSection>
          <SidePanelSeparator />

          <ActionsSection>
            <ActionStepRow>
              <ActionTitle>CHOOSE YOUR SIDE</ActionTitle>
              <SupportCandidate>
                Support
                <ThumbIcon>
                  <Img alt="like" src={likeIconSrc} />
                </ThumbIcon>
              </SupportCandidate>
              <OpposeCandidate>
                Oppose
                <ThumbIcon>
                  <Img alt="dislike" src={thumbsDownIconSrc} />
                </ThumbIcon>
              </OpposeCandidate>
            </ActionStepRow>

            <ActionStepRow>
              <ActionTitle>TOKENS TO COMMIT</ActionTitle>
              <ActionInstructions>
                Please enter the amount of tokens you wish to commit to your vote
              </ActionInstructions>

              <InputFormRow>
                <InputNumTokens onChange={e => handleInputChange(e, 'numTokens')} />
                <SubmitButton onClick={this.handleSaveFile}>SUBMIT</SubmitButton>
              </InputFormRow>
            </ActionStepRow>

            <ActionStepRow>
              <ActionTitle>GENERATE TICKET TO REVEAL</ActionTitle>
              <DownloadTicket />
              <Button>SUBMIT</Button>
            </ActionStepRow>
          </ActionsSection>

          <ReturnToRegistry>
            <ArrowIcon>
              <Img alt="goback" src={leftArrowIconSrc} />
            </ArrowIcon>
            Go back to registry
          </ReturnToRegistry>
        </SidePanel>
      </SidePanelWrapper>
    )
  }
}

export default CommitVote
