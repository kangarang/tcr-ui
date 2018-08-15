import React, { Component } from 'react'
import styled from 'styled-components'

import Radio from 'components/Radio'
import Img from 'components/Img'

import SidePanelSeparator from './components/SidePanelSeparator'
import DetailsSection from './components/DetailsSection'
import SidePanel from './components/SidePanel'
import { TransactionsContext } from './index'

import leftArrowIcon from 'assets/icons/left-arrow.svg'
// import rightArrowIcon from 'assets/icons/right-arrow-thin.svg'

// import thumbsUpIcon from 'assets/icons/thumbs-up.svg'
import thumbsDownIcon from 'assets/icons/thumbs-down.svg'

import likeIcon from 'assets/icons/like.svg'
// import dislikeIcon from 'assets/icons/dislike.svg'

import { randomSalt } from 'libs/values'
import { getLocal } from 'utils/_localStorage'

const SidePanelWrapper = styled.div`
  font-family: 'Avenir Next';
  /* font-family: ${theme => theme.fontFamily}; */
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
const SupportApplication = styled.div`
  display: flex;
  box-sizing: border-box;
  padding: 0.8em 2em;
  margin: 10px 0;
  border: 1px solid #dde3e8;
  border-radius: 3px;
  background-color: #ffffff;
  font-size: 1.25em;
`
const OpposeApplication = SupportApplication.extend``
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
const NumTokensButton = styled.div`
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
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
    color: magenta;
  }
`
const ReturnToRegistry = styled.div`
  display: flex;
  margin-top: 3em;
`
const ArrowIcon = styled.div`
  width: 20px;
  margin-right: 5px;
`
class CommitVote extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeStep: 0,
      voteOption: '',
      numTokens: '',
      salt: randomSalt(),
    }
  }

  previousStep() {
    this.setState(prevState => ({
      activeStep: prevState.activeStep - 1,
    }))
  }
  nextStep() {
    this.setState(prevState => ({
      activeStep: prevState.activeStep + 1,
    }))
  }

  handleChangeVoteOption = e => this.setState({ voteOption: e.target.value })
  handleChangeNumTokens = e => this.setState({ numTokens: e.target.value })
  handleChangeSalt = e => this.setState({ salt: e.target.value })

  // const key = `${pollID}-${listingID}`
  checkLocal = async key => {
    const local = await getLocal(key)
    if (!local) {
      console.log('nothing in local storage for key:', key)
    } else {
      this.nextStep()
    }
  }

  render() {
    return (
      <SidePanelWrapper>
        <TransactionsContext.Consumer>
          {({ needToApproveVoting, selectedOne, closeTxPanel, onSendTx, opened }) => (
            <SidePanel
              title="Commit Your Vote"
              opened={opened === 'commitVote'}
              onClose={closeTxPanel}
            >
              {/* <ArrowIcon>
            <Img src={rightArrowIcon} />
          </ArrowIcon> */}
              <SidePanelSeparator />

              {/* TODO: convert to stateless function */}
              <DetailsSection listing={selectedOne} />
              <SidePanelSeparator />

              {/* TODO: convert to Provider/Consumer */}
              <ActionsSection>
                <ActionStepRow>
                  <ActionTitle>{'CHOOSE YOUR SIDE'}</ActionTitle>
                  <SupportApplication>
                    <Radio
                      checked={this.state.voteOption === '1'}
                      value="1"
                      color="primary"
                      handleCheckRadio={this.handleChangeVoteOption}
                    />
                    {'Support'}
                    <ThumbIcon>
                      <Img alt="like" src={likeIcon} />
                    </ThumbIcon>
                  </SupportApplication>
                  <OpposeApplication>
                    <Radio
                      checked={this.state.voteOption === '0'}
                      value="0"
                      color="secondary"
                      handleCheckRadio={this.handleChangeVoteOption}
                    />
                    {'Oppose'}
                    <ThumbIcon>
                      <Img alt="dislike" src={thumbsDownIcon} />
                    </ThumbIcon>
                  </OpposeApplication>
                </ActionStepRow>

                <ActionStepRow>
                  <ActionTitle>TOKENS TO COMMIT</ActionTitle>
                  <ActionInstructions>
                    Please enter the amount of tokens you wish to commit to your vote
                  </ActionInstructions>

                  <InputFormRow>
                    <InputNumTokens
                      value={this.state.numTokens}
                      onChange={this.handleChangeNumTokens}
                    />
                    {needToApproveVoting ? (
                      <NumTokensButton
                        onClick={() => onSendTx('approveVoting', this.state)}
                      >
                        APPROVE
                      </NumTokensButton>
                    ) : (
                      <NumTokensButton onClick={() => onSendTx('commitVote', this.state)}>
                        SUBMIT
                      </NumTokensButton>
                    )}
                  </InputFormRow>
                </ActionStepRow>

                {/* <ActionStepRow>
                  <ActionTitle>GENERATE TICKET TO REVEAL</ActionTitle>
                  <DownloadTicket />
                  <Button onClick={() => onSendTx('commitVote', this.state)}>
                    SUBMIT
                  </Button>
                </ActionStepRow> */}
              </ActionsSection>

              <ReturnToRegistry>
                <ArrowIcon>
                  <Img alt="goback" src={leftArrowIcon} />
                </ArrowIcon>
                Go back to registry
              </ReturnToRegistry>
            </SidePanel>
          )}
        </TransactionsContext.Consumer>
      </SidePanelWrapper>
    )
  }
}

export default CommitVote
