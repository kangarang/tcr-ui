import React, { Component } from 'react'

import Button from 'components/Button'
import { MarginDiv } from 'components/StyledHome'

import { SideSplit, SideText } from 'containers/Transactions/components'

import { getLocal } from 'utils/_localStorage'

import { TransactionsContext } from './index'
import SidePanelSeparator from './components/SidePanelSeparator'
import SidePanel from './components/SidePanel'

export default class RevealVote extends Component {
  state = {
    numTokens: '',
    ticket: {},
  }

  componentDidMount() {
    // this.getCommitHash()
    this.handleGetLocal()
  }
  handleGetLocal = async () => {
    const listing = this.props.selectedOne
    const key = `${listing.challengeID}-${listing.listingID}`
    const localFile = await getLocal(key)
    console.log('localFile:', localFile)

    this.setState({
      ticket: localFile.ticket,
    })
  }

  render() {
    const { ticket } = this.state

    return (
      <TransactionsContext.Consumer>
        {({
          closeSidePanel,
          selectedOne,
          opened,
          balances,
          handleRevealVote,
          handleFileInput,
        }) => (
          <SidePanel
            title="Reveal Vote"
            opened={opened === 'revealVote'}
            onClose={closeSidePanel}
          >
            <SideSplit
              leftTitle={'Voting Rights'}
              leftItem={balances.votingRights}
              rightTitle={'Locked Tokens'}
              rightItem={balances.lockedTokens}
            />
            <SideSplit
              leftTitle={'Votes For'}
              leftItem={selectedOne.votesFor}
              rightTitle={'Votes Against'}
              rightItem={selectedOne.votesAgainst}
            />
            <SideSplit
              leftTitle={'Tokens you committed'}
              leftItem={this.props.numTokens}
              rightTitle={'POLL ID'}
              rightItem={selectedOne && selectedOne.challengeID}
            />

            <SideText
              small
              text={`Reveal for vote: ${selectedOne && selectedOne.listingID}`}
            />

            <SidePanelSeparator />

            {selectedOne.didReveal ? (
              <SideText
                text={`You have already revealed with ${
                  this.props.numTokens
                } tokens for this poll`}
              />
            ) : (
              selectedOne.didCommit && <div />
            )}
            <div>
              <SideText
                text={
                  'In order to reveal your previously committed vote, upload the JSON commit file'
                }
              />

              {/* <FileInput type="file" name="file" onChange={handleFileInput} /> */}
              <MarginDiv>
                <Button
                  methodName="revealVote"
                  onClick={() =>
                    handleRevealVote(ticket.pollID, ticket.voteOption, ticket.salt)
                  }
                  mode="strong"
                  wide
                >
                  {'Reveal Vote'}
                </Button>
              </MarginDiv>
            </div>
          </SidePanel>
        )}
      </TransactionsContext.Consumer>
    )
  }
}
