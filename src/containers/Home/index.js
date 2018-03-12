import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import JSONTree from 'react-json-tree'
import {
  SidePanel,
  SidePanelSeparator,
  Button,
  ContextMenu,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  Text,
} from '@aragon/ui'
import { Icon } from 'semantic-ui-react'
import translate from 'translations'
import { jsonTheme } from '../../colors'
import {
  setupEthereum,
  requestModalMethod,
  sendTransaction,
  callRequested,
} from 'actions'
import {
  selectEthjs,
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
  selectMiningStatus,
} from 'selectors'

import { SideSplit, SideText } from 'components/SidePanelOverlay'
import Navigation from 'components/Navigation'
import {
  MarginDiv,
  HomeWrapper,
  CMItem,
  FileInput,
} from 'components/StyledHome'

import { convertedToBaseUnit } from 'utils/_units'
import { withCommas } from 'utils/_values'

import ListingRow from './ListingRow'
import Apply from './Apply'
import Challenge from './Challenge'
import CommitVote from './CommitVote'
import { selectAllContracts } from '../../selectors'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeItem: 0,
      opened: false,
      listingName: '',
      data: '',
      numTokens: '',
      openChallenge: false,
      openCommitVote: false,
      openRevealVote: false,
      openClaimVoterReward: false,
      selectedOne: false,
      fileInput: false,
      methodName: false,
      visibleApprove: false,
      voterReward: '0',
      // miningStatus: false,
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
      openChallenge: false,
      openCommitVote: false,
      openRevealVote: false,
      openClaimVoterReward: false,
    })
  }
  openApprove = () => {
    this.setState({ visibleApprove: true })
  }
  openSidePanel = (one, openThis) => {
    if (!openThis) {
      this.setState({
        opened: true,
      })
    } else {
      this.setState({
        selectedOne: one,
        [openThis]: true,
      })
    }
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

  getMethodArgs(methodName, listing, contract, voteOption) {
    return methodName === 'apply'
      ? [
          this.state.listingName,
          convertedToBaseUnit(this.state.numTokens, 18),
          this.state.data,
        ]
      : methodName === 'challenge'
        ? [
            this.state.selectedOne.get('listingHash'),
            this.state.selectedOne.get('data'),
          ]
        : methodName === 'updateStatus'
          ? [listing.get('listingHash')]
          : methodName === 'rescueTokens'
            ? [listing.getIn(['latest', 'pollID'])]
            : methodName === 'approve'
              ? [
                  this.props[contract].address,
                  convertedToBaseUnit(this.state.numTokens, 18),
                ]
              : methodName === 'requestVotingRights'
                ? [this.state.numTokens]
                : methodName === 'commitVote'
                  ? [
                      this.state.selectedOne.getIn(['latest', 'pollID']),
                      voteOption,
                      this.state.numTokens,
                      this.state.selectedOne.get('data'),
                    ]
                  : methodName === 'revealVote'
                    ? [
                        this.state.selectedOne.getIn(['latest', 'pollID']),
                        this.state.fileInput.voteOption,
                        this.state.fileInput.salt,
                      ]
                    : methodName === 'claimVoterReward'
                      ? [
                          this.state.selectedOne.getIn(['latest', 'pollID']),
                          this.state.fileInput.salt,
                        ]
                      : false
  }

  handleSendTransaction = (methodName, listing, contract, voteOption) => {
    const args = this.getMethodArgs(methodName, listing, contract, voteOption)
    if (args) {
      this.props.onSendTransaction({ methodName, args, listing, contract })
    }
    // this.setState({
    //   miningStatus: true
    // })
  }

  render() {
    const {
      candidates,
      faceoffs,
      whitelist,
      account,
      balances,
      parameters,
      token,
      contracts,
    } = this.props

    return (
      <div>
        <Navigation {...this.props} openSidePanel={this.openSidePanel} />

        <Apply
          opened={this.state.opened}
          closeSidePanel={this.closeSidePanel}
          parameters={parameters}
          token={token}
          contracts={contracts}
          balances={balances}
          visibleApprove={this.state.visibleApprove}
          openApprove={this.openApprove}
          handleInputChange={this.handleInputChange}
          handleSendTransaction={this.handleSendTransaction}
        />

        <Challenge
          opened={this.state.openChallenge}
          closeSidePanel={this.closeSidePanel}
          parameters={parameters}
          token={token}
          contracts={contracts}
          balances={balances}
          visibleApprove={this.state.visibleApprove}
          openApprove={this.openApprove}
          openChallenge={this.state.openChallenge}
          selectedOne={this.state.selectedOne}
          handleInputChange={this.handleInputChange}
          handleSendTransaction={this.handleSendTransaction}
        />

        <CommitVote
          closeSidePanel={this.closeSidePanel}
          parameters={parameters}
          token={token}
          contracts={contracts}
          balances={balances}
          visibleApprove={this.state.visibleApprove}
          openApprove={this.openApprove}
          openCommitVote={this.state.openCommitVote}
          selectedOne={this.state.selectedOne}
          handleInputChange={this.handleInputChange}
          handleSendTransaction={this.handleSendTransaction}
        />

        <SidePanel
          title="Reveal Vote"
          opened={this.state.openRevealVote}
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

          <SideText icon={'unlock'} small text={'REVEAL VOTE'} />
          <SideText
            small
            text={this.state.selectedOne && this.state.selectedOne.get('data')}
          />

          <SidePanelSeparator />

          <SideText icon={'check circle'} small text={'INSTRUCTIONS'} />

          <SideText text={translate('sidebar_revealVote_instructions')} />

          <MarginDiv>
            <FileInput
              type="file"
              name="file"
              onChange={this.handleFileInput}
            />
          </MarginDiv>
          <MarginDiv>
            <Button
              onClick={e => this.handleSendTransaction('revealVote')}
              mode="strong"
              wide
            >
              {'Reveal Vote'}
            </Button>
          </MarginDiv>
        </SidePanel>

        <SidePanel
          title="Claim Voter Reward"
          opened={this.state.openClaimVoterReward}
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

          <SideText icon={'unlock'} small text={'CLAIM VOTER REWARD'} />
          <SideText small text={this.state.voterReward} />

          <SidePanelSeparator />

          <SideText icon={'check circle'} small text={'INSTRUCTIONS'} />

          <SideText text={translate('sidebar_claimVoterReward_instructions')} />

          <MarginDiv>
            <FileInput
              type="file"
              name="file"
              onChange={this.handleFileInput}
            />
          </MarginDiv>
          <MarginDiv>
            <Button
              onClick={e =>
                this.handleSendTransaction('claimVoterReward', null, 'registry')
              }
              mode="strong"
              wide
            >
              {'Claim Voter Reward'}
            </Button>
          </MarginDiv>
        </SidePanel>

        <HomeWrapper>
          <div>
            {'CANDIDATES'}
            <Table
              header={
                <TableRow>
                  <TableHeader title="Listing" />
                  <TableHeader title="Time Remaining" />
                  <TableHeader title="Details" />
                  <TableHeader title="Tokens required to challenge" />
                  <TableHeader title="Badges" />
                  <TableHeader title="Actions" />
                </TableRow>
              }
            >
              {candidates.map(candidate => (
                <ListingRow
                  key={candidate.get('listingHash')}
                  listing={candidate}
                  parameters={parameters}
                  token={token}
                  contracts={contracts}
                  account={account}
                  handleSendTransaction={this.handleSendTransaction}
                  openSidePanel={this.openSidePanel}
                  listingHash={candidate.get('listingHash')}
                  listingType={'candidates'}
                />
              ))}
            </Table>
          </div>

          <div>
            {'CHALLENGES'}
            <Table
              header={
                <TableRow>
                  <TableHeader title="Listing" />
                  <TableHeader title="Time Remaining" />
                  <TableHeader title="Details" />
                  <TableHeader title="Badges" />
                  <TableHeader title="Actions" />
                </TableRow>
              }
            >
              {faceoffs.map(one => (
                <ListingRow
                  key={one.get('listingHash')}
                  listing={one}
                  parameters={parameters}
                  token={token}
                  contracts={contracts}
                  account={account}
                  handleSendTransaction={this.handleSendTransaction}
                  openSidePanel={this.openSidePanel}
                  listingHash={one.get('listingHash')}
                  listingType={'faceoffs'}
                />
              ))}
            </Table>
          </div>

          <div>
            {'REGISTRY'}
            <Table
              header={
                <TableRow>
                  <TableHeader title="Listing" />
                  <TableHeader title="Deposit" />
                  <TableHeader title="Registered on block" />
                  <TableHeader title="Actions" />
                </TableRow>
              }
            >
              {whitelist.map(one => (
                <TableRow key={one.get('listingHash')}>
                  <TableCell>
                    <Text>{one.get('ipfsID')}</Text>
                  </TableCell>

                  <TableCell>{one.getIn(['latest', 'numTokens'])}</TableCell>

                  <TableCell>
                    <JSONTree
                      invertTheme={false}
                      theme={jsonTheme}
                      data={one}
                      shouldExpandNode={(keyName, data, level) => false}
                    />
                  </TableCell>

                  <TableCell>
                    <ContextMenu>
                      <CMItem
                        onClick={e => this.openSidePanel(one, 'openChallenge')}
                      >
                        <Icon
                          name="remove circle outline"
                          size="large"
                          color="orange"
                        />
                        {'Challenge Listing'}
                      </CMItem>
                      <CMItem
                        onClick={e =>
                          this.openSidePanel(one, 'openClaimVoterReward')
                        }
                      >
                        <Icon name="check" size="large" color="orange" />
                        {'Claim Voter Reward'}
                      </CMItem>
                    </ContextMenu>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </div>
        </HomeWrapper>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSetupEthereum: network => dispatch(setupEthereum(network)),
    onRequestModalMethod: e => dispatch(requestModalMethod(e)),
    onSendTransaction: payload => dispatch(sendTransaction(payload)),
    onCall: payload => dispatch(callRequested(payload)),
  }
}

const mapStateToProps = createStructuredSelector({
  error: selectError,
  ethjs: selectEthjs,
  account: selectAccount,
  network: selectNetwork,

  balances: selectBalances,
  miningStatus: selectMiningStatus,

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
