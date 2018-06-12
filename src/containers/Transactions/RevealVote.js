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
    commitHash: '',
    numTokens: '',
    votesFor: '',
    votesAgainst: '',
  }
  componentDidMount() {
    this.getCommitHash()
  }

  getCommitHash = async () => {
    const poll = await this.props.voting.pollMap(
      this.props.selectedOne.get('challengeID')
    )
    const votesFor = baseToConvertedUnit(poll[3], this.props.tcr.get('tokenDecimals'))
    const votesAgainst = baseToConvertedUnit(poll[4], this.props.tcr.get('tokenDecimals'))

    const numTokensRaw = (await this.props.voting.getNumTokens(
      this.props.account,
      this.props.selectedOne.get('challengeID')
    ))['0']
    const numTokens = baseToConvertedUnit(
      numTokensRaw,
      this.props.tcr.get('tokenDecimals')
    )

    const commitHash = (await this.props.voting.getCommitHash(
      this.props.account,
      this.props.selectedOne.get('challengeID')
    ))['0']

    if (
      commitHash !== '0x0000000000000000000000000000000000000000000000000000000000000000'
    ) {
      this.setState({
        commitHash,
        numTokens,
        votesFor,
        votesAgainst,
      })
    }
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
        {this.state.commitHash ? (
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
