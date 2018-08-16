import React, { Component } from 'react'

import { MarginDiv } from 'components/StyledHome'
import Button from 'components/Button'

import SidePanelSeparator from './components/SidePanelSeparator'
import DetailsSection from './components/DetailsSection'
import SidePanel from './components/SidePanel'
import SideSplit from './components/SideSplit'
import SideText from './components/SideText'

import { fromTokenBase } from 'libs/units'
import { getLocalForage } from 'libs/localStorage'

import { TransactionsContext } from './index'

export default class RevealVote extends Component {
  state = {
    ticket: {
      numTokens: '',
    },
  }
  componentDidMount() {
    this.handleGetLocal()
  }

  handleGetLocal = async () => {
    const listing = this.props.selectedOne
    const key = `${listing.challengeID}-${listing.listingID}`
    const localFile = await getLocalForage(key)
    console.log('localFile:', localFile)
    console.log('listing:', listing)

    if (localFile) {
      this.setState({
        ticket: localFile.ticket,
      })
    }
  }

  render() {
    return (
      <TransactionsContext.Consumer>
        {({
          closeTxPanel,
          selectedOne,
          opened,
          balances,
          handleFileInput,
          onSendTx,
          tcr,
        }) => (
          <SidePanel
            title="Reveal Vote"
            opened={opened === 'revealVote'}
            onClose={closeTxPanel}
          >
            <SideSplit
              leftTitle={'Voting Rights'}
              leftItem={balances.votingRights}
              rightTitle={'Locked Tokens'}
              rightItem={balances.lockedTokens}
            />
            <SideSplit
              leftTitle={'Votes For'}
              leftItem={fromTokenBase(selectedOne.votesFor, tcr.tokenDecimals)}
              rightTitle={'Votes Against'}
              rightItem={fromTokenBase(selectedOne.votesAgainst, tcr.tokenDecimals)}
            />
            <SideSplit
              leftTitle={'Tokens You Revealed'}
              leftItem={fromTokenBase(selectedOne.userVotes, tcr.tokenDecimals)}
              rightTitle={'POLL ID'}
              rightItem={selectedOne && selectedOne.challengeID}
            />

            <DetailsSection listing={selectedOne} />

            <SidePanelSeparator />

            {/* <FileInput type="file" name="file" onChange={handleFileInput} /> */}
            {this.state.ticket.voteOption ? (
              <MarginDiv>
                <SideText
                  small
                  text={`Reveal for vote: ${selectedOne && selectedOne.listingID}`}
                />
                <SideText
                  text={`Your vote: ${
                    this.state.ticket.voteOption === '0' ? 'Oppose' : 'Support'
                  }`}
                />
                <Button
                  methodName="revealVote"
                  onClick={() => onSendTx('revealVote', this.state.ticket)}
                  mode="strong"
                  wide
                >
                  {'Reveal Vote'}
                </Button>
              </MarginDiv>
            ) : (
              <SideText text={'You have not committed to this poll'} />
            )}
          </SidePanel>
        )}
      </TransactionsContext.Consumer>
    )
  }
}
