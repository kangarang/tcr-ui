import React from 'react'
import styled from 'styled-components'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import Button from '../components/Button'
import Img from '../components/Img'

import SidePanel from '../containers/Transactions/components/SidePanel'
import SideTextInput from '../containers/Transactions/components/SideTextInput'
import SidePanelSeparator from '../containers/Transactions/components/SidePanelSeparator'

import leftArrowIconSrc from 'assets/icons/left-arrow.svg'
import rightArrowIconSrc from 'assets/icons/right-arrow-thin.svg'
import thumbsUpIconSrc from 'assets/icons/thumbs-up.svg'
import thumbsDownIconSrc from 'assets/icons/thumbs-down.svg'
import likeIconSrc from 'assets/icons/like.svg'
import dislikeIconSrc from 'assets/icons/dislike.svg'

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

storiesOf('SidePanels', module).add('Commit Vote', () => (
  <SidePanelWrapper>
    <SidePanel title="Commit Your Vote" opened={true} onClose={action('CLOSE')}>
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
              <Img src={likeIconSrc} />
            </ThumbIcon>
          </SupportCandidate>
          <OpposeCandidate>
            Oppose
            <ThumbIcon>
              <Img src={thumbsDownIconSrc} />
            </ThumbIcon>
          </OpposeCandidate>
        </ActionStepRow>

        <ActionStepRow>
          <ActionTitle>TOKENS TO COMMIT</ActionTitle>
          <ActionInstructions>
            Please enter the amount of tokens you wish to commit to your vote
          </ActionInstructions>

          <InputFormRow>
            <InputNumTokens />
            <SubmitButton>SUBMIT</SubmitButton>
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
          <Img src={leftArrowIconSrc} />
        </ArrowIcon>
        Go back to registry
      </ReturnToRegistry>
    </SidePanel>
  </SidePanelWrapper>
))
