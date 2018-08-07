import React, { Component } from 'react'

import Button from 'components/Button'
import { MarginDiv } from 'components/StyledHome'

import { SideSplit, SideText } from 'containers/Transactions/components'

import { baseToConvertedUnit } from 'libs/units'
import { getLocal } from 'utils/_localStorage'

import { TransactionsContext } from './index'
import SidePanelSeparator from './components/SidePanelSeparator'
import SidePanel from './components/SidePanel'
import DetailsSection from './components/DetailsSection'

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
    const localFile = await getLocal(key)
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
          closeSidePanel,
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
              leftItem={baseToConvertedUnit(selectedOne.votesFor, tcr.tokenDecimals)}
              rightTitle={'Votes Against'}
              rightItem={baseToConvertedUnit(selectedOne.votesAgainst, tcr.tokenDecimals)}
            />
            <SideSplit
              leftTitle={'Tokens You Revealed'}
              leftItem={baseToConvertedUnit(selectedOne.userVotes, tcr.tokenDecimals)}
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
