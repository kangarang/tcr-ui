import React, { Component } from 'react'
// import translate from 'translations'

import { baseToConvertedUnit } from 'libs/units'

import Button from 'components/Button'
import { SideSplit, SideText } from 'containers/Transactions/components'
import { MarginDiv, FileInput } from 'components/StyledHome'

import SidePanelSeparator from './components/SidePanelSeparator'
import SidePanel from './components/SidePanel'

export default class RevealVote extends Component {
  state = {
    didCommit: false,
    didReveal: false,
    numTokens: '',
    votesFor: '',
    votesAgainst: '',
  }

  constructor(props) {
    super(props)
    this.getCommitHash = this.getCommitHash.bind(this)
  }

  componentDidMount() {
    if (this.props.selectedOne.get('challengeID') !== false) {
      this.getCommitHash()
    }
  }

  async getCommitHash() {
    const votesFor = baseToConvertedUnit(
      this.props.selectedOne.get('votesFor'),
      this.props.tcr.get('tokenDecimals')
    )
    const votesAgainst = baseToConvertedUnit(
      this.props.selectedOne.get('votesAgainst'),
      this.props.tcr.get('tokenDecimals')
    )

    const numTokensRaw = (await this.props.voting.getNumTokens(
      this.props.account,
      this.props.selectedOne.get('challengeID')
    ))['0']
    const numTokens = baseToConvertedUnit(
      numTokensRaw.toString(),
      this.props.tcr.get('tokenDecimals')
    )

    const didCommit = (await this.props.voting.didCommit(
      this.props.account,
      this.props.selectedOne.get('challengeID')
    ))['0']
    const didReveal = (await this.props.voting.didReveal(
      this.props.account,
      this.props.selectedOne.get('challengeID')
    ))['0']

    this.setState({
      didCommit,
      didReveal,
      numTokens,
      votesFor,
      votesAgainst,
    })
  }

  render() {
    const {
      opened,
      closeSidePanel,
      balances,
      handleFileInput,
      handleRevealVote,
      selectedOne,
    } = this.props

    return (
      <SidePanel title="Reveal Vote" opened={opened} onClose={closeSidePanel}>
        <SideSplit
          leftTitle={'Voting Rights'}
          leftItem={balances.get('votingRights')}
          rightTitle={'Locked Tokens'}
          rightItem={balances.get('lockedTokens')}
        />
        <SideSplit
          leftTitle={'Votes For'}
          leftItem={this.state.votesFor}
          rightTitle={'Votes Against'}
          rightItem={this.state.votesAgainst}
        />
        <SideSplit
          leftTitle={'Tokens you committed'}
          leftItem={this.state.numTokens}
          rightTitle={'POLL ID'}
          rightItem={selectedOne && selectedOne.get('challengeID')}
        />

        <SideText
          small
          text={`Reveal for vote: ${selectedOne && selectedOne.get('listingID')}`}
        />

        <SidePanelSeparator />

        {this.state.didReveal ? (
          <SideText
            text={`You have already revealed with ${
              this.state.numTokens
            } tokens for this poll`}
          />
        ) : this.state.didCommit ? (
          <div>
            <SideText
              text={
                'In order to reveal your previously committed vote, upload the JSON commit file'
              }
            />

            <FileInput type="file" name="file" onChange={handleFileInput} />
            <MarginDiv>
              <Button
                methodName="revealVote"
                onClick={handleRevealVote}
                mode="strong"
                wide
              >
                {'Reveal Vote'}
              </Button>
            </MarginDiv>
          </div>
        ) : (
          <SideText text={'You have not voted in this poll.'} />
        )}
      </SidePanel>
    )
  }
}
