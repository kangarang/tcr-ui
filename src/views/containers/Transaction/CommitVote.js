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
      needToApprove,
    } = this.props
    return (
      <div>
        <SidePanel title="Commit Vote" opened={opened} onClose={closeSidePanel}>
          <SideSplit
            leftTitle={'Token Balance'}
            leftItem={balances.get('token')}
            rightTitle={'Voting Allowance'}
            rightItem={balances.get('votingAllowance')}
          />
          <SideSplit
            leftTitle={'Voting Rights'}
            leftItem={balances.get('votingRights')}
            rightTitle={'Locked Tokens'}
            rightItem={balances.get('lockedTokens')}
          />

          <SideText
            size="large"
            title="token"
            small
            text={
              selectedOne &&
              `${selectedOne.getIn(['tokenData', 'name'])} (${selectedOne.getIn([
                'tokenData',
                'symbol',
              ])})`
            }
          />

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
              <div>
                <SideText text={translate('ins_requestVotingRights')} />
                <Button onClick={handleRequestVotingRights} mode="strong" wide>
                  {'Request Voting Rights'}
                </Button>
              </div>
            ) : (
              <div>
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
              </div>
            )}
          </MarginDiv>

          <MarginDiv>
            <Button onClick={handleRequestVotingRights} mode="strong" wide>
              {'Request Voting Rights'}
            </Button>
            <Button onClick={e => handleApprove('voting')} mode="strong" wide>
              {'Approve tokens for Voting'}
            </Button>
          </MarginDiv>
        </SidePanel>
      </div>
    )
  }
}
