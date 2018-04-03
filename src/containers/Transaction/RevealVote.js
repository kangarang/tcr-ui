import React, { Component } from 'react'
import translate from 'translations'
import { withCommas } from 'utils/_values'

import SidePanel from './SidePanel'
import TxnProgress from './TxnProgress'

import Button from 'components/Button'
import { SideSplit, SideText } from 'containers/Transaction/components'
import { MarginDiv, FileInput } from 'components/StyledHome'

import SidePanelSeparator from './components/SidePanelSeparator'
import { baseToConvertedUnit } from '../../utils/_units'

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
    const poll = await this.props.voting.functions.pollMap(
      this.props.selectedOne.get('challengeID')
    )
    const votesFor = baseToConvertedUnit(poll[3], 18)
    const votesAgainst = baseToConvertedUnit(poll[4], 18)

    const numTokensRaw = await this.props.voting.functions.getNumTokens(
      this.props.account,
      this.props.selectedOne.get('challengeID')
    )
    const numTokens = baseToConvertedUnit(numTokensRaw, 18)

    const commitHash = await this.props.voting.functions.getCommitHash(
      this.props.account,
      this.props.selectedOne.get('challengeID')
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
      parameters,
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
          leftTitle={'Reveal Period'}
          leftItem={`Reveal: ${parameters.get('revealStageLen')} seconds`}
          rightTitle={'POLL ID'}
          rightItem={selectedOne && selectedOne.get('challengeID')}
        />
        <SideSplit
          leftTitle={'Votes For'}
          leftItem={this.state.votesFor}
          rightTitle={'Votes Against'}
          rightItem={this.state.votesAgainst}
        />
        <SideSplit
          leftTitle={'Commit Hash'}
          leftItem={this.state.commitHash.substring(0, 10)}
          rightTitle={'Tokens Committed'}
          rightItem={this.state.numTokens}
        />
        <SideSplit
          leftTitle={'Locked Tokens'}
          leftItem={withCommas(balances.get('lockedTokens'))}
          rightTitle={'Voting Rights'}
          rightItem={withCommas(balances.get('votingRights'))}
        />

        <SideText small text={'REVEAL VOTE'} />
        <SideText small text={selectedOne && selectedOne.get('listingID')} />

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
            <Button href={`https://rinkeby.etherscan.io/tx/${latestTxn.get('hash')}`}>
              {'etherscan'}
            </Button>
            <TxnProgress />
          </div>
        )}
      </SidePanel>
    )
  }
}
