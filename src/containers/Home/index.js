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
  Countdown,
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
  selectNetworkID,
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
import { convertedToBaseUnit, withCommas } from 'utils/units_utils'
import vote_utils from 'utils/vote_utils'
import { dateHasPassed } from 'utils/format-date'

import { SideSplit, SideText } from 'components/Transaction'
import Navigation from 'components/Navigation'

import {
  MarginDiv,
  HomeWrapper,
  CMItem,
  FileInput,
} from 'components/StyledHome'

import ListingRow from '../ListingRow'

import Apply from './Apply'
import Challenge from './Challenge'
import CommitVote from './CommitVote'
// import SideTextInput from './components/SideTextInput'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeItem: 0,
      opened: false,
      listingName: '',
      numTokens: '',
      openChallenge: false,
      openCommitVote: false,
      openRevealVote: false,
      openClaimVoterReward: false,
      selectedOne: false,
      revealedVote: false,
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
      vR = await this.props.registry.contract.voterReward.call(
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
          revealedVote: json,
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
          vote_utils.getListingHash(this.state.listingName),
          convertedToBaseUnit(this.state.numTokens, 18),
          this.state.listingName,
        ]
      : methodName === 'challenge'
        ? [
            this.state.selectedOne.get('listingHash'),
            this.state.selectedOne.get('listingString'),
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
                      this.state.selectedOne.get('listingString'),
                    ]
                  : methodName === 'revealVote'
                    ? [
                        this.state.selectedOne.getIn(['latest', 'pollID']),
                        this.state.revealedVote.voteOption,
                        this.state.revealedVote.salt,
                      ]
                    : methodName === 'claimVoterReward'
                      ? [
                          this.state.selectedOne.getIn(['latest', 'pollID']),
                          this.state.revealedVote.salt,
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
    // var ipfs = ipfsAPI('localhost', '5001', { protocol: 'http' }) // leaving out the arguments will default to these values

    // or connect with multiaddr
    // var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001')
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
    } = this.props

    return (
      <div>
        <Navigation {...this.props} openSidePanel={this.openSidePanel} />

        <Apply
          opened={this.state.opened}
          closeSidePanel={this.closeSidePanel}
          parameters={parameters}
          token={token}
          balances={balances}
          visibleApprove={this.state.visibleApprove}
          openApprove={this.openApprove}
          handleInputChange={this.handleInputChange}
          handleSendTransaction={this.handleSendTransaction}
        />

        <Challenge
          opened={this.state.opened}
          closeSidePanel={this.closeSidePanel}
          parameters={parameters}
          token={token}
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
            text={
              this.state.selectedOne &&
              this.state.selectedOne.get('listingString')
            }
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
                  account={account}
                  handleSendTransaction={this.handleSendTransaction}
                  openSidePanel={this.openSidePanel}
                  listingHash={candidate.get('listingHash')}
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
                <TableRow key={one.get('listingHash')}>
                  <TableCell>
                    <Text>{one.get('listingString')}</Text>
                  </TableCell>

                  <TableCell>
                    {!dateHasPassed(one.getIn(['latest', 'commitEndDate'])) ? (
                      <Countdown
                        end={one.getIn(['latest', 'commitExpiry', 'date'])}
                      />
                    ) : !dateHasPassed(
                      one.getIn(['latest', 'revealEndDate'])
                    ) ? (
                      <Countdown
                        end={one.getIn(['latest', 'revealExpiry', 'date'])}
                      />
                    ) : (
                      'Ready to update'
                    )}
                  </TableCell>

                  <TableCell>
                    <JSONTree
                      invertTheme={false}
                      theme={jsonTheme}
                      data={one}
                      shouldExpandNode={(keyName, data, level) => false}
                    />
                  </TableCell>

                  <TableCell>
                    {one.get('owner') === account ? (
                      <div>
                        <Icon
                          name="exclamation circle"
                          size="large"
                          color="orange"
                        />
                        <Icon name="check circle" size="large" color="blue" />
                      </div>
                    ) : (
                      <Icon
                        name="exclamation circle"
                        size="large"
                        color="orange"
                      />
                    )}
                  </TableCell>

                  <TableCell>
                    <ContextMenu>
                      {!dateHasPassed(
                        one.getIn(['latest', 'commitEndDate'])
                      ) && (
                        <CMItem
                          onClick={e =>
                            this.openSidePanel(one, 'openCommitVote')
                          }
                        >
                          <Icon
                            name="check circle"
                            size="large"
                            color="orange"
                          />
                          {'Commit Token Vote'}
                        </CMItem>
                      )}
                      {dateHasPassed(one.getIn(['latest', 'commitEndDate'])) &&
                        !dateHasPassed(
                          one.getIn(['latest', 'revealEndDate'])
                        ) && (
                          <CMItem
                            onClick={e =>
                              this.openSidePanel(one, 'openRevealVote')
                            }
                          >
                            <Icon name="unlock" size="large" color="orange" />
                            {'Reveal Token Vote'}
                          </CMItem>
                        )}
                      {dateHasPassed(
                        one.getIn(['latest', 'revealEndDate'])
                      ) && (
                        <div>
                          <CMItem
                            onClick={e =>
                              this.handleSendTransaction('updateStatus', one)
                            }
                          >
                            <Icon name="magic" size="large" color="purple" />
                            <div>{'Update Status'}</div>
                          </CMItem>
                          <CMItem
                            onClick={e =>
                              this.handleSendTransaction('rescueTokens', one)
                            }
                          >
                            <Icon
                              name="exclamation circle"
                              size="large"
                              color="orange"
                            />
                            {'Rescue Tokens'}
                          </CMItem>
                          <CMItem
                            onClick={e =>
                              this.openSidePanel(one, 'openClaimVoterReward')
                            }
                          >
                            <Icon name="check" size="large" color="orange" />
                            {'Claim Voter Reward'}
                          </CMItem>
                        </div>
                      )}
                    </ContextMenu>
                  </TableCell>
                </TableRow>
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
                    <Text>{one.get('listingString')}</Text>
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
  networkID: selectNetworkID,

  balances: selectBalances,
  miningStatus: selectMiningStatus,

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
