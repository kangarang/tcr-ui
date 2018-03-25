import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import { SidePanelSeparator, Button } from '@aragon/ui'
import translate from 'translations'

import {
  setupEthereum,
  requestModalMethod,
  sendTransaction,
  callRequested,
  chooseTCR,
} from 'actions'

import {
  selectProvider,
  selectAccount,
  selectNetwork,
  selectBalances,
  selectRegistry,
  selectToken,
  selectVoting,
  selectParameters,
  selectCandidates,
  selectFaceoffs,
  selectWhitelist,
  selectError,
  selectAllContracts,
  selectLatestTxn,
  selectMiningStatus,
} from 'selectors'

import { convertedToBaseUnit } from 'utils/_units'
import { withCommas } from 'utils/_values'

import Apply from 'containers/Transaction/Apply'
import Challenge from 'containers/Transaction/Challenge'
import CommitVote from 'containers/Transaction/CommitVote'
import SidePanel from 'containers/Transaction/SidePanel'
import TxnProgress from 'containers/Transaction/TxnProgress'

import AppBar from 'components/AppBar'
import { SideSplit, SideText } from 'components/SidePanelOverlay'
import { MarginDiv, FileInput } from 'components/StyledHome'

import Stats from '../Stats'
import Tabs from '../Tabs'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeItem: 0,
      opened: false,
      listingName: '',
      data: '',
      numTokens: '',
      selectedOne: false,
      fileInput: false,
      methodName: false,
      visibleApprove: false,
      voterReward: '0',
      expand: '',
    }
  }
  componentDidMount() {
    this.props.onSetupEthereum()
  }

  // side panel
  closeSidePanel = () => {
    this.setState({
      opened: false,
    })
  }
  openApprove = () => {
    this.setState({ visibleApprove: true })
  }
  chooseTCR = one => {
    this.props.onChooseTCR(one)
  }
  openSidePanel = (one, openThis) => {
    this.setState({
      selectedOne: one,
      opened: openThis,
    })
  }

  getVoterReward = async (pollID, salt) => {
    let vR
    try {
      vR = await this.props.registry.voterReward.call(
        this.props.account,
        pollID,
        salt
      )
    } catch (err) {
      vR = 'No reward :('
    }
    this.setState({
      voterReward: vR.toString(10),
    })
  }
  handleFileInput = e => {
    const file = e.target.files[0]
    const fr = new window.FileReader()

    fr.onload = () => {
      const contents = fr.result
      const json = JSON.parse(contents)

      try {
        this.setState({
          fileInput: json,
        })
      } catch (error) {
        throw new Error('Invalid Commit JSON file')
      }

      this.getVoterReward(json.pollID, json.salt)
    }

    fr.readAsText(file)
  }
  handleInputChange = (e, t) => {
    this.setState({
      [t]: e.target.value,
    })
  }

  render() {
    const {
      candidates,
      faceoffs,
      whitelist,
      // account,
      registry,
      balances,
      parameters,
      token,
      contracts,
      miningStatus,
      latestTxn,
    } = this.props

    return (
      <div>
        <AppBar
          {...this.props}
          openSidePanel={e => this.openSidePanel(null, 'apply')}
        />

        <Stats {...this.props} />

        <Apply
          opened={this.state.opened === 'apply'}
          closeSidePanel={this.closeSidePanel}
          parameters={parameters}
          token={token}
          contracts={contracts}
          balances={balances}
          visibleApprove={this.state.visibleApprove}
          openApprove={this.openApprove}
          handleInputChange={this.handleInputChange}
          handleApprove={this.handleApprove}
          handleApply={this.handleApply}
          miningStatus={miningStatus}
          latestTxn={latestTxn}
        />

        <Challenge
          opened={this.state.opened === 'challenge'}
          closeSidePanel={this.closeSidePanel}
          parameters={parameters}
          token={token}
          contracts={contracts}
          balances={balances}
          visibleApprove={this.state.visibleApprove}
          openApprove={this.openApprove}
          selectedOne={this.state.selectedOne}
          handleInputChange={this.handleInputChange}
          handleApprove={this.handleApprove}
          handleChallenge={this.handleChallenge}
          miningStatus={miningStatus}
          latestTxn={latestTxn}
        />

        <CommitVote
          opened={this.state.opened === 'commitVote'}
          closeSidePanel={this.closeSidePanel}
          parameters={parameters}
          token={token}
          contracts={contracts}
          balances={balances}
          visibleApprove={this.state.visibleApprove}
          openApprove={this.openApprove}
          selectedOne={this.state.selectedOne}
          handleInputChange={this.handleInputChange}
          handleApprove={this.handleApprove}
          handleCommitVote={this.handleCommitVote}
          handleRequestVotingRights={this.handleRequestVotingRights}
          miningStatus={miningStatus}
          latestTxn={latestTxn}
        />

        <SidePanel
          title="Reveal Vote"
          opened={this.state.opened === 'revealVote'}
          onClose={this.closeSidePanel}
        >
          <SideSplit
            leftTitle={'Reveal Period'}
            leftItem={`Reveal: ${parameters.get('revealStageLen')} seconds`}
            rightTitle={'POLL ID'}
            rightItem={
              this.state.selectedOne &&
              this.state.selectedOne.getIn(['latest', 'pollID'])
            }
          />
          <SideSplit
            leftTitle={'Token Balance'}
            leftItem={withCommas(balances.get('token'))}
            rightTitle={'Voting Allowance'}
            rightItem={withCommas(balances.get('votingAllowance'))}
          />

          <SideText small text={'REVEAL VOTE'} />
          <SideText
            small
            text={
              this.state.selectedOne && this.state.selectedOne.get('ipfsID')
            }
          />

          <SidePanelSeparator />

          <SideText small text={'INSTRUCTIONS'} />

          <SideText text={translate('sidebar_revealVote_instructions')} />

          <MarginDiv>
            <FileInput
              type="file"
              name="file"
              onChange={this.handleFileInput}
            />
          </MarginDiv>
          <MarginDiv>
            <Button onClick={this.handleRevealVote} mode="strong" wide>
              {'Reveal Vote'}
            </Button>
          </MarginDiv>
          {miningStatus && <TxnProgress />}
        </SidePanel>

        <SidePanel
          title="Claim Voter Reward"
          opened={this.state.opened === 'claimVoterReward'}
          onClose={this.closeSidePanel}
        >
          <SideSplit
            leftTitle={'Reveal Period'}
            leftItem={`Reveal: ${parameters.get('revealStageLen')} seconds`}
            rightTitle={'POLL ID'}
            rightItem={
              this.state.selectedOne &&
              this.state.selectedOne.getIn(['latest', 'pollID'])
            }
          />
          <SideSplit
            leftTitle={'Token Balance'}
            leftItem={withCommas(balances.get('token'))}
            rightTitle={'Voting Allowance'}
            rightItem={withCommas(balances.get('votingAllowance'))}
          />

          <SideText small text={'CLAIM VOTER REWARD'} />
          <SideText small text={this.state.voterReward} />

          <SidePanelSeparator />

          <SideText small text={'INSTRUCTIONS'} />

          <SideText text={translate('sidebar_claimVoterReward_instructions')} />

          <MarginDiv>
            <FileInput
              type="file"
              name="file"
              onChange={this.handleFileInput}
            />
          </MarginDiv>
          <MarginDiv>
            <Button onClick={this.handleClaimVoterReward} mode="strong" wide>
              {'Claim Voter Reward'}
            </Button>
          </MarginDiv>
          {miningStatus && <TxnProgress />}
        </SidePanel>

        <Tabs
          registry={registry}
          candidates={candidates}
          faceoffs={faceoffs}
          whitelist={whitelist}
          openSidePanel={this.openSidePanel}
          chooseTCR={this.chooseTCR}
          handleUpdateStatus={this.handleUpdateStatus}
        />
      </div>
    )
  }

  // TRANSACTIONS
  handleApprove = contract => {
    const args = [
      this.props[contract].address,
      convertedToBaseUnit(this.state.numTokens, 18),
    ]
    this.props.onSendTransaction({ methodName: 'approve', args })
  }
  handleApply = () => {
    const args = [
      this.state.listingName,
      convertedToBaseUnit(this.state.numTokens, 18),
      this.state.data,
    ]
    this.props.onSendTransaction({ methodName: 'apply', args })
  }
  handleChallenge = () => {
    const args = [
      this.state.selectedOne.get('listingHash'),
      this.state.selectedOne.get('data'),
    ]
    this.props.onSendTransaction({ methodName: 'challenge', args })
  }
  handleRequestVotingRights = () => {
    const args = [this.state.numTokens]
    this.props.onSendTransaction({ methodName: 'requestVotingRights', args })
  }
  handleCommitVote = voteOption => {
    const args = [
      this.state.selectedOne.getIn(['latest', 'pollID']),
      voteOption,
      this.state.numTokens,
      this.state.selectedOne.get('ipfsID'),
    ]
    this.props.onSendTransaction({ methodName: 'commitVote', args })
  }
  handleRevealVote = () => {
    const args = [
      this.state.selectedOne.getIn(['latest', 'pollID']),
      this.state.fileInput.voteOption,
      this.state.fileInput.salt,
    ]
    this.props.onSendTransaction({ methodName: 'revealVote', args })
  }
  handleUpdateStatus = listing => {
    const args = [listing.get('listingHash')]
    this.props.onSendTransaction({ methodName: 'updateStatus', args })
  }
  handleRescueTokens = listing => {
    const args = [listing.getIn(['latest', 'pollID'])]
    this.props.onSendTransaction({ methodName: 'rescueTokens', args })
  }
  handleClaimVoterReward = () => {
    const args = [
      this.state.selectedOne.getIn(['latest', 'pollID']),
      this.state.fileInput.salt,
    ]
    this.props.onSendTransaction({ methodName: 'claimVoterReward', args })
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSetupEthereum: network => dispatch(setupEthereum(network)),
    onChooseTCR: tcr => dispatch(chooseTCR(tcr)),
    onRequestModalMethod: e => dispatch(requestModalMethod(e)),
    onSendTransaction: payload => dispatch(sendTransaction(payload)),
    onCall: payload => dispatch(callRequested(payload)),
  }
}

const mapStateToProps = createStructuredSelector({
  error: selectError,
  provider: selectProvider,
  account: selectAccount,
  network: selectNetwork,

  balances: selectBalances,
  miningStatus: selectMiningStatus,
  latestTxn: selectLatestTxn,

  contracts: selectAllContracts,
  registry: selectRegistry,
  token: selectToken,
  voting: selectVoting,

  parameters: selectParameters,

  candidates: selectCandidates,
  faceoffs: selectFaceoffs,
  whitelist: selectWhitelist,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(Home)
