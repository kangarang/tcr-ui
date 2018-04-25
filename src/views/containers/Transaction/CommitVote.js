import React, { Component } from 'react'
import translate from 'views/translations'

import { colors } from 'views/global-styles'
import { baseToConvertedUnit } from 'redux/libs/units'

import { MarginDiv } from 'views/components/StyledHome'
import Button from 'views/components/Button'
import Text from 'views/components/Text'

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
    const numTokensRaw = (await this.props.voting.getNumTokens(
      this.props.account,
      this.props.selectedOne.get('challengeID')
    ))['0']
    const commitHash = (await this.props.voting.getCommitHash(
      this.props.account,
      this.props.selectedOne.get('challengeID')
    ))['0']
    const numTokens = baseToConvertedUnit(
      numTokensRaw,
      this.props.tcr.get('tokenDecimals')
    )
    if (
      commitHash !== '0x0000000000000000000000000000000000000000000000000000000000000000'
    ) {
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
      needToApprove,
      showApprove,
    } = this.props
    return (
      <div>
        <SidePanel title="Commit Vote" opened={opened} onClose={closeSidePanel}>
          <SideSplit
            leftTitle={'Poll ID'}
            leftItem={selectedOne && selectedOne.get('challengeID')}
            rightTitle={'Token Balance'}
            rightItem={balances.get('token')}
          />
          <SideSplit
            leftTitle={'Commit Hash'}
            leftItem={this.state.commitHash.substring(0, 10)}
            rightTitle={'Tokens Committed'}
            rightItem={this.state.numTokens}
          />
          <SideSplit
            leftTitle={'Voting Rights'}
            leftItem={balances.get('votingRights')}
            rightTitle={'Locked Tokens'}
            rightItem={balances.get('lockedTokens')}
          />

          <SideText text={selectedOne && selectedOne.get('listingID')} />

          <SidePanelSeparator />

          <MarginDiv>
            <SideTextInput
              title="token amount"
              type="number"
              handleInputChange={e => handleInputChange(e, 'numTokens')}
            />

            {needToApprove ? (
              <Text size="xlarge" color="red" children={translate('must_approve')} />
            ) : balances.get('votingRights') === '0.0' ? (
              <MarginDiv>
                <SideText text={translate('ins_requestVotingRights')} />
                <Button onClick={handleRequestVotingRights} mode="strong" wide>
                  {'Request Voting Rights'}
                </Button>
              </MarginDiv>
            ) : (
              <MarginDiv>
                <SideText text={translate('ins_commitVote')} />
                <Button onClick={e => handleCommitVote('1')}>
                  {'Support the applicant'}
                </Button>
                <Button
                  onClick={e => handleCommitVote('0')}
                  bgColor={colors.darkRed}
                  fgColor={'white'}
                >
                  {'Oppose the applicant'}
                </Button>
                <Button onClick={showApprove} mode="">
                  {'Show request voting rights'}
                </Button>
              </MarginDiv>
            )}
          </MarginDiv>

          {needToApprove && (
            <MarginDiv>
              <Button onClick={handleRequestVotingRights} mode="strong" wide>
                {'Request Voting Rights'}
              </Button>
              <Button onClick={e => handleApprove('voting')} mode="strong" wide>
                {'Approve tokens for Voting'}
              </Button>
            </MarginDiv>
          )}

          {miningStatus && (
            <div>
              <Button
                wide
                href={`https://rinkeby.etherscan.io/tx/${latestTxn.get(
                  'transactionHash'
                )}`}
              >
                {'etherscan'}
              </Button>
              <TxnProgress />
            </div>
          )}
        </SidePanel>
      </div>
    )
  }
}
