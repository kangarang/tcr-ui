import React, { Component } from 'react'
import translate from 'translations'

import { colors } from 'views/global-styles'
import { baseToConvertedUnit } from 'state/libs/units'

import { MarginDiv } from 'views/components/StyledHome'
import Button from 'views/components/Button'

import { SideSplit, SideText, SideTextInput } from './components'
import SidePanelSeparator from './components/SidePanelSeparator'
import SidePanel from './components/SidePanel'
import TxnProgress from './TxnProgress'

export default class CommitVote extends Component {
  state = {
    commitHash: '',
    numTokens: '',
  }
  componentDidMount() {
    this.getCommitHash()
  }

  getCommitHash = async () => {
    const numTokensRaw = await this.props.voting.getNumTokens(
      this.props.account,
      this.props.selectedOne.challengeID
    )
    const commitHash = await this.props.voting.getCommitHash(
      this.props.account,
      this.props.selectedOne.challengeID
    )
    const numTokens = baseToConvertedUnit(numTokensRaw, 18)
    if (commitHash !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
      this.setState({
        commitHash,
        numTokens,
      })
    }
  }
  render() {
    const {
      opened,
      closeSidePanel,
      balances,
      selectedOne,
      handleInputChange,
      handleApprove,
      handleCommitVote,
      handleRequestVotingRights,
      miningStatus,
      latestTxn,
    } = this.props
    return (
      <div>
        <SidePanel title="Commit Vote" opened={opened} onClose={closeSidePanel}>
          <SideSplit
            leftTitle={'Poll ID'}
            leftItem={selectedOne && selectedOne.challengeID}
            rightTitle={'Token Balance'}
            rightItem={balances.token}
          />
          <SideSplit
            leftTitle={'Commit Hash'}
            leftItem={this.state.commitHash.substring(0, 10)}
            rightTitle={'Tokens Committed'}
            rightItem={this.state.numTokens}
          />
          <SideSplit
            leftTitle={'Voting Rights'}
            leftItem={balances.votingRights}
            rightTitle={'Locked Tokens'}
            rightItem={balances.lockedTokens}
          />

          <SideText text={selectedOne && selectedOne.listingID} />

          <SidePanelSeparator />

          <MarginDiv>
            <SideTextInput
              title="token amount"
              type="number"
              handleInputChange={e => handleInputChange(e, 'numTokens')}
            />

            {balances.votingRights === '0.0' ? (
              <MarginDiv>
                <SideText text={translate('ins_requestVotingRights')} />
                <Button onClick={handleRequestVotingRights} mode="strong" wide>
                  {'Request Voting Rights'}
                </Button>
              </MarginDiv>
            ) : (
              <MarginDiv>
                <SideText text={translate('ins_commitVote')} />
                <Button onClick={e => handleCommitVote('1')}>{'Support the applicant'}</Button>
                <Button
                  onClick={e => handleCommitVote('0')}
                  bgColor={colors.darkRed}
                  fgColor={'white'}
                >
                  {'Oppose the applicant'}
                </Button>
              </MarginDiv>
            )}
          </MarginDiv>

          {miningStatus && (
            <div>
              <Button
                wide
                href={`https://rinkeby.etherscan.io/tx/${latestTxn.get('transactionHash')}`}
              >
                {'etherscan'}
              </Button>
              <TxnProgress />
            </div>
          )}

          <MarginDiv>
            <Button onClick={e => handleApprove('voting')} mode="strong" wide>
              {'Approve tokens for Voting'}
            </Button>
          </MarginDiv>
        </SidePanel>
      </div>
    )
  }
}
