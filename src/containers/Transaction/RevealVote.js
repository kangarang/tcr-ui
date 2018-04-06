import React, { Component } from 'react'
import translate from 'translations'

import SidePanel from './components/SidePanel'
import TxnProgress from './TxnProgress'

import Button from 'components/Button'
import { SideSplit, SideText } from 'containers/Transaction/components'
import { MarginDiv, FileInput } from 'components/StyledHome'

import SidePanelSeparator from './components/SidePanelSeparator'
import { baseToConvertedUnit } from '../../libs/units'

export default class RevealVote extends Component {
  constructor(props) {
    super(props)
    this.state = {
      commitHash: '',
      numTokens: '',
      votesFor: '',
      votesAgainst: '',
    }
  }
  componentDidMount() {
    this.getCommitHash()
  }

  getCommitHash = async () => {
    const poll = await this.props.voting.functions.pollMap(this.props.selectedOne.challengeID)
    const votesFor = baseToConvertedUnit(poll[3], 18)
    const votesAgainst = baseToConvertedUnit(poll[4], 18)

    const numTokensRaw = await this.props.voting.functions.getNumTokens(
      this.props.account,
      this.props.selectedOne.challengeID
    )
    const numTokens = baseToConvertedUnit(numTokensRaw, 18)

    const commitHash = await this.props.voting.functions.getCommitHash(
      this.props.account,
      this.props.selectedOne.challengeID
    )

    if (commitHash !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
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
      miningStatus,
      latestTxn,
    } = this.props
    return (
      <SidePanel title="Reveal Vote" opened={opened} onClose={closeSidePanel}>
        <SideSplit
          leftTitle={'Voting Rights'}
          leftItem={balances.votingRights}
          rightTitle={'Locked Tokens'}
          rightItem={balances.lockedTokens}
        />
        <SideSplit
          leftTitle={'Votes For'}
          leftItem={this.state.votesFor}
          rightTitle={'Votes Against'}
          rightItem={this.state.votesAgainst}
        />
        <SideSplit
          leftTitle={'Tokens Committed'}
          leftItem={this.state.numTokens}
          rightTitle={'POLL ID'}
          rightItem={selectedOne && selectedOne.challengeID}
        />

        <SideText small text={'REVEAL VOTE'} />
        <SideText small text={selectedOne && selectedOne.listingID} />

        <SidePanelSeparator />

        <SideText text={'INSTRUCTIONS'} />

        <SideText text={translate('ins_revealVote')} />

        <MarginDiv>
          <FileInput type="file" name="file" onChange={handleFileInput} />
        </MarginDiv>
        <MarginDiv>
          <Button onClick={handleRevealVote} mode="strong" wide>
            {'Reveal Vote'}
          </Button>
        </MarginDiv>
        {miningStatus && (
          <div>
            <Button href={`https://rinkeby.etherscan.io/tx/${latestTxn.hash}`}>
              {'etherscan'}
            </Button>
            <TxnProgress />
          </div>
        )}
      </SidePanel>
    )
  }
}
