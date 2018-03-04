import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'
import JSONTree from 'react-json-tree'

import {
  SidePanel,
  SidePanelSplit,
  SidePanelSeparator,
  Section,
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
import { colors, jsonTheme } from '../../colors'

import Identicon from '../../components/Identicon'
import SidePanelCalls from './components/SidePanelCalls'

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
  selectRegistryMethods,
  selectVotingMethods,
  selectMiningStatus,
} from '../../selectors'

import {
  toUnitAmount,
  toNaturalUnitAmount,
  withCommas,
  BN,
} from '../../utils/units_utils'
import vote_utils from '../../utils/vote_utils'
import { dateHasPassed } from '../../utils/format-date'

const AppBarWrapper = styled.div`
  flex-shrink: 0;
`
const AppBar = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 4em;
  background-color: ${colors.offWhite};
  border-bottom: 1px solid ${colors.orange};
  padding: 0 3em;
  & > div {
    margin: 0 1em;
  }
`
const MarginDiv = styled.div`
  margin: 1em 0;
`
const OverFlowDiv = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
`
const HomeWrapper = styled.div`
  padding: 2em;
`

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
      openCallPanel: false,
      selectedOne: false,
      revealedVote: false,
      methodName: false,
      visibleApprove: false,
    }
  }
  componentDidMount() {
    this.props.onSetupEthereum()
  }
  handleCall = (contract, method) => {
    const args = Object.values(this.state[method.name])
    console.log('args', args)
    this.props.onCall({ args, contract, method })
  }
  handleCallInputChange = (e, methodName, inputName) => {
    const value = e.target.value
    this.setState(prevState => ({
      ...prevState,
      [methodName]: {
        ...prevState[methodName],
        [inputName]: value,
      },
    }))
  }

  // side panel
  closeSidePanel = () => {
    this.setState({
      opened: false,
      openCallPanel: false,
      openChallenge: false,
      openCommitVote: false,
      openRevealVote: false,
    })
  }
  openCallPanel = contract => {
    this.setState({
      openCallPanel: contract,
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

  // input changes
  handleFileInput = e => {
    const file = e.target.files[0]
    const fr = new window.FileReader()

    fr.onload = () => {
      const contents = fr.result

      try {
        const jsonFC = JSON.parse(contents)
        this.setState({
          revealedVote: jsonFC,
        })
        console.log('jsonFC', jsonFC)
      } catch (error) {
        throw new Error('Invalid Commit JSON file')
      }
    }

    fr.readAsText(file)
  }
  handleInputChange = (e, t) => {
    this.setState({
      [t]: e.target.value,
    })
  }

  handleSendTransaction = (methodName, listing, contract, voteOption) => {
    const args = this.getMethodArgs(methodName, listing, contract, voteOption)
    if (args) {
      this.props.onSendTransaction({ methodName, args, listing })
    }
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
      registryMethods,
      votingMethods,
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
                    : networkID === '420' ? 'ganache' : networkID
              }`}</div>
              <Text color="red" weight="bold">
                {miningStatus && 'MINING'}
              </Text>
              <OverFlowDiv>{account}</OverFlowDiv>
              {/* {`Ether Balance: ${withCommas(balances.get('ETH'))} ΞTH`}
                {`${token.name} Balance: ${withCommas(trimDecimalsThree(balances.get('token')))} ${token.symbol}`} */}
            </AppBar>
          )}
        </AppBarWrapper>

        <JSONTree
          invertTheme={false}
          theme={jsonTheme}
          data={balances}
          shouldExpandNode={(keyName, data, level) => false}
        />

        <SidePanel
          title="Apply a Listing into the Registry"
          opened={this.state.opened}
          onClose={this.closeSidePanel}
        >
          <SidePanelSplit
            children={[
              <Section>
                <Text weight="bold">{'Application Period'}</Text>
                <h2>
                  {parameters.get('applyStageLen')}
                  {' seconds'}
                </h2>
              </Section>,
              <Section>
                <Text weight="bold">{'Minimum Deposit'}</Text>
                <h2>
                  {toUnitAmount(parameters.get('minDeposit'), 18).toString()}{' '}
                  {token.symbol}
                </h2>
              </Section>,
            ]}
          />

          <SidePanelSplit
            children={[
              <Section>
                <Text weight="bold">{'Token Balance'}</Text>
                <h2>{withCommas(balances.get('token'))}</h2>
              </Section>,
              <Section>
                <Text weight="bold">{'Registry Allowance'}</Text>
                <h2>{withCommas(balances.get('registryAllowance'))}</h2>
              </Section>,
            ]}
          />

          <MarginDiv>
            <Icon name="question circle outline" size="small" />
            <Text color="grey" smallcaps>
              {'QUESTION'}
            </Text>
          </MarginDiv>
          <MarginDiv>
            <Text>{translate('sidebar_apply_question')}</Text>
          </MarginDiv>
          <MarginDiv>
            <Icon name="check circle" size="small" />
            <Text color="grey" smallcaps>
              {'INSTRUCTIONS'}
            </Text>
          </MarginDiv>
          <MarginDiv>
            <Text>{translate('sidebar_apply_instructions')}</Text>
          </MarginDiv>

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

        <SidePanelCalls
          contract={'registry'}
          methods={registryMethods}
          openCallPanel={this.state.openCallPanel}
          closeSidePanel={this.closeSidePanel}
          handleCallInputChange={this.handleCallInputChange}
          handleCall={this.handleCall}
        />

        <SidePanelCalls
          contract={'voting'}
          methods={votingMethods}
          openCallPanel={this.state.openCallPanel}
          closeSidePanel={this.closeSidePanel}
          handleCallInputChange={this.handleCallInputChange}
          handleCall={this.handleCall}
        />

        <SidePanel
          title="Challenge listing"
          opened={this.state.openChallenge}
          onClose={this.closeSidePanel}
        >
          <SidePanelSplit
            children={[
              <Section>
                <Text weight="bold">{'Challenge Period'}</Text>
                <h1>{`Commit: ${parameters.get(
                  'commitStageLen'
                )} seconds & Reveal: ${parameters.get(
                  'revealStageLen'
                )} seconds`}</h1>
              </Section>,
              <Section>
                <Text weight="bold">{'Minimum Deposit'}</Text>
                <h2>
                  {toUnitAmount(parameters.get('minDeposit'), 18).toString()}{' '}
                  {token.symbol}
                </h2>
              </Section>,
            ]}
          />

          <SidePanelSplit
            children={[
              <Section>
                <Text weight="bold">{'Token Balance'}</Text>
                <h2>{withCommas(balances.get('token'))}</h2>
              </Section>,
              <Section>
                <Text weight="bold">{'Registry Allowance'}</Text>
                <h2>{withCommas(balances.get('registryAllowance'))}</h2>
              </Section>,
            ]}
          />

          <MarginDiv>
            <Text color="grey" smallcaps>
              {'LISTING'}
            </Text>
          </MarginDiv>
          <MarginDiv>
            <Text>
              {this.state.selectedOne &&
                this.state.selectedOne.get('listingString')}
            </Text>
          </MarginDiv>

          <SidePanelSeparator />

          <MarginDiv>
            <Icon name="exclamation triangle" size="small" />
            <Text color="grey" smallcaps>
              {'WARNING'}
            </Text>
          </MarginDiv>
          <MarginDiv>
            <Text>{translate('sidebar_challenge_instructions')}</Text>
          </MarginDiv>

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
          <SidePanelSplit
            children={[
              <Section>
                <Text weight="bold">{'POLL ID'}</Text>
                <h2>
                  {this.state.selectedOne &&
                    this.state.selectedOne.getIn(['latest', 'pollID'])}
                </h2>
              </Section>,
              <Section>
                <Text weight="bold">{'Token Balance'}</Text>
                <h2>{withCommas(balances.get('token'))}</h2>
              </Section>,
            ]}
          />

          {/* TODO: show inc/dec numTokens depending on user input */}
          <SidePanelSplit
            children={[
              <Section>
                <Text weight="bold">{'Voting Rights'}</Text>
                <h2>{withCommas(balances.get('votingRights'))}</h2>
              </Section>,
              <Section>
                <Text weight="bold">{'Voting Allowance'}</Text>
                <h2>{withCommas(balances.get('votingAllowance'))}</h2>
              </Section>,
            ]}
          />

          <MarginDiv>
            <Icon name="lock" />
            <Text color="grey" smallcaps>
              {'COMMIT VOTE'}
            </Text>
          </MarginDiv>
          <MarginDiv>
            <Text>
              {this.state.selectedOne &&
                this.state.selectedOne.get('listingString')}
            </Text>
          </MarginDiv>

          <SidePanelSeparator />

          <MarginDiv>
            <MarginDiv>
              <Text color="grey" smallcaps>
                {'Token Amount'}
              </Text>
            </MarginDiv>
            <TextInput
              onChange={e => this.handleInputChange(e, 'numTokens')}
              wide
              type="number"
            />

            {balances.get('votingRights') === '0' ? (
              <MarginDiv>
                <MarginDiv>
                  <Text>
                    {translate('sidebar_requestVotingRights_instructions')}
                  </Text>
                </MarginDiv>
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
                <MarginDiv>
                  <Text>{translate('sidebar_commitVote_instructions')}</Text>
                </MarginDiv>
                <Button
                  onClick={e =>
                    this.handleSendTransaction('commitVote', null, null, 1)
                  }
                  emphasis="positive"
                  mode="strong"
                >
                  {'Support the applicant'}
                </Button>{' '}
                <Button
                  onClick={e =>
                    this.handleSendTransaction('commitVote', null, null, 0)
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
            <MarginDiv>
              <Text>{translate('sidebar_approve_instructions')}</Text>
            </MarginDiv>
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
          <SidePanelSplit
            children={[
              <Section>
                <Text weight="bold">{'Reveal Token'}</Text>
                <h1>{`Reveal: ${parameters.get('revealStageLen')} seconds`}</h1>
              </Section>,
              <Section>
                <Text weight="bold">{'POLL ID'}</Text>
                <h2>
                  {this.state.selectedOne &&
                    this.state.selectedOne.getIn(['latest', 'pollID'])}
                </h2>
              </Section>,
            ]}
          />

          <SidePanelSplit
            children={[
              <Section>
                <Text weight="bold">{'Token Balance'}</Text>
                <h2>{withCommas(balances.get('token'))}</h2>
              </Section>,
              <Section>
                <Text weight="bold">{'Voting Allowance'}</Text>
                <h2>{withCommas(balances.get('votingAllowance'))}</h2>
              </Section>,
            ]}
          />

          <MarginDiv>
            <Icon name="unlock" />
            <Text color="grey" smallcaps>
              {'REVEAL VOTE'}
            </Text>
          </MarginDiv>
          <MarginDiv>
            <Text>
              {this.state.selectedOne &&
                this.state.selectedOne.get('listingString')}
            </Text>
          </MarginDiv>

          <SidePanelSeparator />

          <MarginDiv>
            <Icon name="check circle" size="small" />
            <Text color="grey" smallcaps>
              {'INSTRUCTIONS'}
            </Text>
          </MarginDiv>
          <MarginDiv>
            <Text>{translate('sidebar_revealVote_instructions')}</Text>
          </MarginDiv>
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

        <HomeWrapper>
          <MarginDiv>
            <Button mode="strong" onClick={this.openSidePanel}>
              {'Apply Listing'}
            </Button>{' '}
            <Button mode="strong" onClick={e => this.openCallPanel('registry')}>
              {'Call Registry Methods'}
            </Button>{' '}
            <Button mode="strong" onClick={e => this.openCallPanel('voting')}>
              {'Call Voting Methods'}
            </Button>
          </MarginDiv>

          {candidates.size > 0 && (
            <div>
              {'CANDIDATES'}
              <Table
                header={
                  <TableRow>
                    <TableHeader title="Listing" />
                    <TableHeader title="Time Remaining" />
                    <TableHeader title="Staked Tokens" />
                    <TableHeader title="Badges" />
                    <TableHeader title="Actions" />
                  </TableRow>
                }
              >
                {candidates.map(one => (
                  <TableRow key={one.get('listingHash')}>
                    {/* stats */}
                    <TableCell>
                      <Text>{one.get('listingString')}</Text>
                    </TableCell>
                    <TableCell>
                      {!dateHasPassed(one.getIn(['appExpiry', 'date'])) ? (
                        <Countdown end={one.getIn(['appExpiry', 'date'])} />
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
                            color="yellow"
                          />
                          <Icon name="check circle" size="large" color="blue" />
                        </div>
                      ) : (
                        <Icon
                          name="exclamation circle"
                          size="large"
                          color="yellow"
                        />
                      )}
                    </TableCell>
                    {/* actions */}
                    <TableCell>
                      <ContextMenu>
                        {one.get('appExpired') && (
                          <CMItem
                            onClick={e =>
                              this.handleSendTransaction('updateStatus', one)
                            }
                          >
                            <Icon name="magic" size="large" color="purple" />
                            {'Update Status'}
                          </CMItem>
                        )}
                        {/* <CMItem onClick={e => this.handleDepositWithdraw(one, 'deposit')}>
                          <Icon name='angle double up' size='large' color='green' />
                          {'Deposit Tokens'}
                        </CMItem>
                        <CMItem onClick={e => this.handleDepositWithdraw(one, 'withdraw')}>
                          <Icon name='angle double down' size='large' color='yellow' />
                          {'Withdraw Tokens'}
                        </CMItem> */}
                        <CMItem
                          onClick={e =>
                            this.openSidePanel(one, 'openChallenge')
                          }
                        >
                          <Icon
                            name="exclamation circle"
                            size="large"
                            color="red"
                          />
                          {'Challenge Listing'}
                        </CMItem>
                      </ContextMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </Table>
            </div>
          )}

          {faceoffs.size > 0 && (
            <div>
              {'FACEOFFS'}
              <Table
                header={
                  <TableRow>
                    <TableHeader title="Listing" />
                    <TableHeader title="Time Remaining" />
                    <TableHeader title="" />
                    {/* <TableHeader title="Number of Tokens Voted" /> */}
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
                                this.handleSendTransaction('claimVoterReward')
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

const CMItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 20px;
  cursor: pointer;
  white-space: nowrap;
  & > div {
    padding: 5px;
  }
`
const FileInput = styled.input`
  padding: 1em;
  border: 2px solid ${colors.prism};
`

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
  registryMethods: selectRegistryMethods,
  votingMethods: selectVotingMethods,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(Home)
