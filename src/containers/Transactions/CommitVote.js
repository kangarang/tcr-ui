import React, { Component } from 'react'
import styled from 'styled-components'

import Button from 'components/Button'
import Img from 'components/Img'
import SidePanelSeparator from './components/SidePanelSeparator'
import SidePanel from './components/SidePanel'
import Radio from 'components/Radio'
import { TransactionsContext } from './index'

import leftArrowIconSrc from 'assets/icons/left-arrow.svg'
// import rightArrowIconSrc from 'assets/icons/right-arrow-thin.svg'
// import thumbsUpIconSrc from 'assets/icons/thumbs-up.svg'
import thumbsDownIconSrc from 'assets/icons/thumbs-down.svg'
import likeIconSrc from 'assets/icons/like.svg'
// import dislikeIconSrc from 'assets/icons/dislike.svg'

import { getVoteSaltHash, randomSalt } from 'libs/values'
import { getEndDateString } from 'utils/_datetime'
import { getLocal, saveLocal } from 'utils/_localStorage'

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
  constructor(props) {
    super(props)
    this.state = {
      commitHash: '',
      numTokens: '',
      activeStep: 0,
      selectedValue: '',
      salt: randomSalt(),
      choice: '',
    }
  }

  handleChange = event => {
    const choice =
      event.target.value === '0'
        ? '- Oppose'
        : event.target.value === '1' ? '- Support' : ''
    this.setState({ selectedValue: event.target.value, choice })
  }

  render() {
    return (
      <div>
        <TransactionsContext.Consumer>
          {({
            needToApproveVoting,
            selectedOne,
            closeSidePanel,
            handleApprove,
            handleCommitVote,
            handleInputChange,
            opened,
          }) => (
            <SidePanel
              title="Commit Your Vote"
              opened={opened === 'commitVote'}
              onClose={closeSidePanel}
            >
              {/* <ArrowIcon>
            <Img src={rightArrowIconSrc} />
          </ArrowIcon> */}
              <SidePanelSeparator />

              <DetailsSection>
                <ListingIconSquare>
                  {selectedOne.listingData && (
                    <Img src={selectedOne.listingData} alt="" />
                  )}
                </ListingIconSquare>

                <ListingInfoColumn>
                  <ListingTitle>{selectedOne.listingID}</ListingTitle>

                  <ListingCountdown>
                    <div>Vote Ends In</div>
                    <div>00 : 20 : 00</div>
                  </ListingCountdown>
                </ListingInfoColumn>
              </DetailsSection>
              <SidePanelSeparator />

              <ActionsSection>
                <ActionStepRow>
                  <ActionTitle>{'CHOOSE YOUR SIDE'}</ActionTitle>
                  <SupportCandidate>
                    <Radio
                      on={true}
                      // checked={this.state.selectedValue === '1'}
                      // onChange={this.handleChange}
                      value="1"
                      color="primary"
                      handleCheckRadio={this.handleChange}
                    />
                    {'Support'}
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
                  <Button onClick={handleCommitVote}>SUBMIT</Button>
                </ActionStepRow>
              </ActionsSection>

              <ReturnToRegistry>
                <ArrowIcon>
                  <Img alt="goback" src={leftArrowIconSrc} />
                </ArrowIcon>
                Go back to registry
              </ReturnToRegistry>
            </SidePanel>
          )}
        </TransactionsContext.Consumer>
      </div>
    )
  }
}

export default CommitVote

// handleSaveFile = async () => {
//   const commitEndDate = this.props.selectedOne.commitExpiry.timestamp
//   const revealEndDate = this.props.selectedOne.revealExpiry.timestamp

//   // record expiry dates
//   const commitEndDateString = getEndDateString(commitEndDate)
//   const revealEndDateString = getEndDateString(revealEndDate)
//   const salt = this.state.salt.toString(10)
//   // const voteOption = this.state.selectedValue
//   const voteOption = '1'
//   const pollID = this.props.selectedOne.challengeID
//   const listingID = this.props.selectedOne.listingID

//   const secretHash = getVoteSaltHash(voteOption, salt)
//   const json = {
//     voteOption,
//     numTokens: this.props.numTokens,
//     commitEnd: commitEndDateString,
//     revealEnd: revealEndDateString,
//     listingID,
//     salt,
//     pollID,
//     secretHash,
//     account: this.props.account,
//   }
//   // const yon = voteOption === '1' ? 'for' : 'against'
//   // const listingDashed = data.replace(' ', '-')
//   // const filename = `${pollID}-${yon}-${listingID}.json`

//   const key = `${pollID}-${listingID}`
//   const local = await getLocal(key)
//   if (!local) {
//     const file = await saveLocal(key, json)
//     // const file = saveFile(json, filename)
//     // this.handleNext()
//     this.props.handleCommitVote('1', this.state.salt)
//   } else {
//     console.log('theres a file saved locally')
//   }
// }

// handleSubmitCommitTokens = () => {
//   this.props.handleCommitVote(this.props.numTokens, this.state.salt)
// }
