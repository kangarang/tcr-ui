import React, { Component } from 'react'

import { MarginDiv, FileInput } from 'components/StyledHome'
import Button from 'components/Button'

import SidePanel from './components/SidePanel'
import { TransactionsContext } from './index'

class ClaimReward extends Component {
  constructor(props) {
    super(props)
    // this.getCommitHash = this.getCommitHash.bind(this)
  }

  // componentDidMount() {
  //   if (this.props.selectedOne.challengeID) {
  //     this.getCommitHash()
  //   }
  // }

  // async getCommitHash() {
  //   const tokenClaims = (await this.props.registry.tokenClaims(
  //     this.props.selectedOne.challengeID,
  //     this.props.account
  //   ))['0']

  //   // const isPassed = (await this.props.voting.isPassed(
  //   //   this.props.selectedOne.challengeID
  //   // ))['0']

  //   const didReveal = (await this.props.voting.didReveal(
  //     this.props.account,
  //     this.props.selectedOne.challengeID
  //   ))['0']

  //   this.setState({
  //     didReveal,
  //     tokenClaims,
  //   })
  // }

  render() {
    return (
      <div>
        <TransactionsContext.Consumer>
          {({
            selectedOne,
            opened,
            closeSidePanel,
            handleFileInput,
            handleClaimReward,
            account,
            voting,
            registry,
          }) => (
            <SidePanel
              title="Claim Reward"
              opened={opened === 'claimReward'}
              onClose={closeSidePanel}
            >
              <MarginDiv>
                <FileInput type="file" name="file" onChange={handleFileInput} />
              </MarginDiv>

              <MarginDiv>
                <Button onClick={handleClaimReward} mode="strong" wide>
                  {'Claim Reward'}
                </Button>
              </MarginDiv>
            </SidePanel>
          )}
        </TransactionsContext.Consumer>
      </div>
    )
  }
}

export default ClaimReward
