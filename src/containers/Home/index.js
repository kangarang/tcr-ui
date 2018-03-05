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
  TextInput,
  Countdown,
} from '@aragon/ui'

import { Icon } from 'semantic-ui-react'

import translate from '../../translations'
import { jsonTheme } from '../../colors'

import Identicon from '../../components/Identicon'
import SideSplit from './components/SideSplit'
import SideText from './components/SideText'
import ListingRow from '../ListingRow'
// import SideTextInput from './components/SideTextInput'

import {
  AppBar,
  AppBarWrapper,
  MarginDiv,
  OverFlowDiv,
  HomeWrapper,
  CMItem,
  FileInput,
} from './components/StyledHome'

import {
  setupEthereum,
  requestModalMethod,
  sendTransaction,
  callRequested,
} from '../../actions'

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
} from '../../selectors'

import {
  toUnitAmount,
  toNaturalUnitAmount,
  withCommas,
  BN,
  trimDecimalsThree,
} from '../../utils/units_utils'
import vote_utils from '../../utils/vote_utils'
import { dateHasPassed } from '../../utils/format-date'

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
          toNaturalUnitAmount(this.state.numTokens, 18),
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
                  toNaturalUnitAmount(this.state.numTokens, 18),
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
      error,
      candidates,
      faceoffs,
      whitelist,
      account,
      balances,
      networkID,
      parameters,
      token,
      miningStatus,
      registry,
    } = this.props

    return (
      <div>
        <AppBarWrapper>
          {error ? (
            <AppBar>
              <div>{error.message}</div>
            </AppBar>
          ) : (
            <AppBar>
              <div>{registry.name}</div>
              <Identicon address={account} diameter={30} />
              <div>{`Network: ${
                networkID === '4'
                  ? 'Rinkeby'
                  : networkID === '1'
                    ? 'Main Net'
                    : networkID === '420' ? 'Ganache' : networkID
              }`}</div>
              <Text color="red" weight="bold">
                {miningStatus && 'MINING'}
              </Text>
              <OverFlowDiv>{account}</OverFlowDiv>
              <div>
                {`Ether Balance: ${withCommas(balances.get('ETH'))} ΞTH`}
              </div>
              <div>
                {`${token.name} Balance: ${withCommas(
                  trimDecimalsThree(balances.get('token'))
                )} ${token.symbol}`}
              </div>
            </AppBar>
          )}
        </AppBarWrapper>

        <SidePanel
          title="Apply a Listing into the Registry"
          opened={this.state.opened}
          onClose={this.closeSidePanel}
        >
          <SideSplit
            leftTitle={'Application Period'}
            leftItem={
              <div>
                {parameters.get('applyStageLen')}
                {' seconds'}
              </div>
            }
            rightTitle={'Minimum Deposit'}
            rightItem={
              <div>
                {toUnitAmount(parameters.get('minDeposit'), 18).toString()}{' '}
                {token.symbol}
              </div>
            }
          />

          <SideSplit
            leftTitle={'Token Balance'}
            leftItem={balances.get('token')}
            rightTitle={'Registry Allowance'}
            rightItem={withCommas(balances.get('registryAllowance'))}
          />

          <SideSplit
            leftTitle={'Voting Rights'}
            leftItem={balances.get('votingRights')}
            rightTitle={'Voting Allowance'}
            rightItem={withCommas(balances.get('votingAllowance'))}
          />

          <SideText
            small
            title={'QUESTION'}
            text={translate('sidebar_apply_question')}
            icon={'question circle outline'}
          />
          <SideText
            small
            title={'INSTRUCTIONS'}
            text={translate('sidebar_apply_instructions')}
            icon={'check circle'}
          />

          <MarginDiv>
            <Text color="grey" smallcaps>
              {'LISTING NAME'}
            </Text>
            <TextInput
              onChange={e => this.handleInputChange(e, 'listingName')}
              wide
              type="text"
            />
          </MarginDiv>

          <MarginDiv>
            <Text color="grey" smallcaps>
              {'TOKEN AMOUNT'}
            </Text>
            <TextInput
              onChange={e => this.handleInputChange(e, 'numTokens')}
              wide
              type="number"
            />
          </MarginDiv>

          <MarginDiv>
            <Button
              onClick={e => this.handleSendTransaction('apply')}
              mode="strong"
            >
              {'Apply Listing'}
            </Button>
          </MarginDiv>

          <SidePanelSeparator />

          {/* if you wanna see approve, you'll see it */}
          {/* if not, and your current allowance is greater than the minimum deposit, you won't see it */}
          <MarginDiv>
            {this.state.visibleApprove ? (
              <Button
                onClick={e =>
                  this.handleSendTransaction('approve', null, 'registry')
                }
                mode="strong"
              >
                {'Approve tokens for Registry'}
              </Button>
            ) : (
              <div>
                {BN(balances.get('registryAllowance')).lt(
                  BN(toUnitAmount(parameters.get('minDeposit'), 18))
                ) ? (
                  <div>
                    <Text color="red">{'YOU NEED TO APPROVE'}</Text>
                    <Button
                      onClick={e =>
                        this.handleSendTransaction('approve', null, 'registry')
                      }
                      mode="strong"
                    >
                      {'Approve tokens for Registry'}
                    </Button>
                  </div>
                ) : (
                  <Button onClick={this.openApprove} mode="">
                    {'Show approve'}
                  </Button>
                )}
              </div>
            )}
          </MarginDiv>
        </SidePanel>

        <SidePanel
          title="Challenge listing"
          opened={this.state.openChallenge}
          onClose={this.closeSidePanel}
        >
          <SideSplit
            leftTitle={'Challenge Period'}
            leftItem={
              <div>{`Commit: ${parameters.get(
                'commitStageLen'
              )} seconds & Reveal: ${parameters.get(
                'revealStageLen'
              )} seconds`}</div>
            }
            rightTitle={'Minimum Deposit'}
            rightItem={
              <div>
                {toUnitAmount(parameters.get('minDeposit'), 18).toString()}{' '}
                {token.symbol}
              </div>
            }
          />

          <SideSplit
            leftTitle={'Token Balance'}
            leftItem={balances.get('token')}
            rightTitle={'Registry Allowance'}
            rightItem={withCommas(balances.get('registryAllowance'))}
          />

          <SideText
            small
            title={'LISTING'}
            text={
              this.state.selectedOne &&
              this.state.selectedOne.get('listingString')
            }
          />

          <SideText
            small
            title={'WARNING'}
            text={translate('sidebar_challenge_instructions')}
            icon={'exclamation triangle'}
          />

          <SidePanelSeparator />

          <MarginDiv>
            {Number(balances.get('registryAllowance')) <
            toUnitAmount(parameters.get('minDeposit'), 18) ? (
              <MarginDiv>
                <MarginDiv>
                  <Text color="grey" smallcaps>
                    {'TOKEN AMOUNT TO APPROVE'}
                  </Text>
                  <TextInput
                    onChange={e => this.handleInputChange(e, 'numTokens')}
                    wide
                    type="number"
                  />
                </MarginDiv>
                <MarginDiv>
                  <Button
                    onClick={e =>
                      this.handleSendTransaction('approve', null, 'registry')
                    }
                    mode="strong"
                    wide
                  >
                    {'Approve tokens for Registry'}
                  </Button>
                </MarginDiv>
              </MarginDiv>
            ) : (
              <Button
                onClick={e => this.handleSendTransaction('challenge')}
                mode="strong"
                wide
              >
                {'CHALLENGE'}
              </Button>
            )}
          </MarginDiv>
        </SidePanel>

        <SidePanel
          title="Commit Vote"
          opened={this.state.openCommitVote}
          onClose={this.closeSidePanel}
        >
          <SideSplit
            leftTitle={'Poll ID'}
            leftItem={
              this.state.selectedOne &&
              this.state.selectedOne.getIn(['latest', 'pollID'])
            }
            rightTitle={'Token Balance'}
            rightItem={withCommas(balances.get('token'))}
          />

          {/* TODO: show inc/dec numTokens depending on user input */}
          <SideSplit
            leftTitle={'Voting Rights'}
            leftItem={balances.get('votingRights')}
            rightTitle={'Voting Allowance'}
            rightItem={withCommas(balances.get('votingAllowance'))}
          />

          <SideText
            small
            title={'COMMIT VOTE'}
            text={
              this.state.selectedOne &&
              this.state.selectedOne.get('listingString')
            }
            icon={'lock'}
          />

          <SidePanelSeparator />

          <MarginDiv>
            <SideText text={'Token Amount'} small />
            <TextInput
              onChange={e => this.handleInputChange(e, 'numTokens')}
              wide
              type="number"
            />

            {balances.get('votingRights') === '0' ? (
              <MarginDiv>
                <SideText
                  text={translate('sidebar_requestVotingRights_instructions')}
                />
                <Button
                  onClick={e =>
                    this.handleSendTransaction('requestVotingRights')
                  }
                  mode="strong"
                  wide
                >
                  {'Request Voting Rights'}
                </Button>
              </MarginDiv>
            ) : (
              <MarginDiv>
                <SideText text={translate('sidebar_commitVote_instructions')} />
                <Button
                  onClick={e =>
                    this.handleSendTransaction('commitVote', null, null, '1')
                  }
                  emphasis="positive"
                  mode="strong"
                >
                  {'Support the applicant'}
                </Button>{' '}
                <Button
                  onClick={e =>
                    this.handleSendTransaction('commitVote', null, null, '0')
                  }
                  emphasis="negative"
                  mode="strong"
                >
                  {'Oppose the applicant'}
                </Button>
              </MarginDiv>
            )}
          </MarginDiv>

          <MarginDiv>
            <SideText text={translate('sidebar_approve_instructions')} />
            <Button
              onClick={e =>
                this.handleSendTransaction('approve', null, 'voting')
              }
              mode="strong"
              wide
            >
              {'Approve tokens for Voting'}
            </Button>
          </MarginDiv>

          <JSONTree
            invertTheme={false}
            theme={jsonTheme}
            data={balances}
            shouldExpandNode={(keyName, data, level) => false}
          />
        </SidePanel>

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
          <MarginDiv>
            <Button mode="strong" onClick={this.openSidePanel}>
              {'Apply Listing'}
            </Button>
          </MarginDiv>

          {/* {candidates.size > 0 && ( */}
            <div>
              {'CANDIDATES'}
              <Table
                header={
                  <TableRow>
                    <TableHeader title="Listing" />
                    <TableHeader title="Time Remaining" />
                    <TableHeader title="" />
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
          {/* )} */}

          {faceoffs.size > 0 && (
            <div>
              {'FACEOFFS'}
              <Table
                header={
                  <TableRow>
                    <TableHeader title="Listing" />
                    <TableHeader title="Time Remaining" />
                    <TableHeader title="Number of Tokens Voted" />
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
                      {!dateHasPassed(
                        one.getIn(['latest', 'commitEndDate'])
                      ) ? (
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
                        {dateHasPassed(
                          one.getIn(['latest', 'commitEndDate'])
                        ) &&
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
          )}

          {whitelist.size > 0 && (
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
                          onClick={e =>
                            this.openSidePanel(one, 'openChallenge')
                          }
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
          )}
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
