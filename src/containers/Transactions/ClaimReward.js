import React, { Component } from 'react'

import { MarginDiv, FileInput } from 'components/StyledHome'
import Button from 'components/Button'

import SidePanel from './components/SidePanel'

class ClaimReward extends Component {
  state = {
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
    const tokenClaims = (await this.props.registry.tokenClaims(
      this.props.selectedOne.get('challengeID'),
      this.props.account
    ))['0']

    // const isPassed = (await this.props.voting.isPassed(
    //   this.props.selectedOne.get('challengeID')
    // ))['0']

    const didReveal = (await this.props.voting.didReveal(
      this.props.account,
      this.props.selectedOne.get('challengeID')
    ))['0']

    this.setState({
      didReveal,
      tokenClaims,
    })
  }

  render() {
    const { opened, closeSidePanel, handleFileInput, handleClaimReward } = this.props

    return (
      <div>
        <SidePanel title="Claim Reward" opened={opened} onClose={closeSidePanel}>
          <MarginDiv>
            <FileInput type="file" name="file" onChange={handleFileInput} />
          </MarginDiv>

          <MarginDiv>
            <Button onClick={handleClaimReward} mode="strong" wide>
              {'Claim Reward'}
            </Button>
          </MarginDiv>
        </SidePanel>
      </div>
    )
  }
}

export default ClaimReward
