import React, { Component } from 'react'
import translate from 'translations'

import { MarginDiv } from 'components/StyledHome'
import Button from 'components/Button'
import { baseToConvertedUnit } from 'libs/units'

import { SideSplit, SideText } from 'containers/Transactions/components'
import SidePanel from './components/SidePanel'
import SidePanelSeparator from './components/SidePanelSeparator'

export default class UpdateStatus extends Component {
  state = {
    didCommit: false,
    didReveal: false,
    numTokens: '0',
    votesFor: '',
    votesAgainst: '',
  }

  constructor(props) {
    super(props)
    this.getCommitHash = this.getCommitHash.bind(this)
  }

  componentDidMount() {
    if (
      this.props.selectedOne.get('challengeID') !== false &&
      this.props.selectedOne.get('challengeID') !== undefined
    ) {
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
    const { opened, closeSidePanel, handleUpdateStatus, selectedOne } = this.props
    return (
      <div>
        <SidePanel
          title="Update a listing's status"
          opened={opened}
          onClose={closeSidePanel}
        >
          {selectedOne && (
            <div>
              <SideSplit
                leftTitle={'Votes For'}
                leftItem={selectedOne.get('votesFor')}
                rightTitle={'Votes Against'}
                rightItem={selectedOne.get('votesAgainst')}
              />
              <SideSplit
                leftTitle={'Tokens you committed'}
                leftItem={this.state.numTokens}
                rightTitle={'POLL ID'}
                rightItem={selectedOne && selectedOne.get('challengeID')}
              />
              <SideText text={selectedOne && selectedOne.get('listingID')} />
            </div>
          )}

          <SidePanelSeparator />

          <SideText small color="grey" text={translate('ins_updateStatus')} />

          <MarginDiv>
            {selectedOne && (
              <Button
                onClick={e => handleUpdateStatus(selectedOne.get('listingHash'))}
                mode="strong"
                wide
                methodName="updateStatus"
              >
                {'UPDATE STATUS'}
              </Button>
            )}
          </MarginDiv>
        </SidePanel>
      </div>
    )
  }
}
