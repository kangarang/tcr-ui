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
  DropDown,
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

import { SideSplit, SideText } from 'components/Transaction'
import Navigation from 'components/Navigation'
import Identicon from 'components/Identicon'
import {
  MarginDiv,
  HomeWrapper,
  CMItem,
  FileInput,
  OverFlowDiv,
} from 'components/StyledHome'

import { convertedToBaseUnit, withCommas, trimDecimalsThree } from 'utils/_units'
import _vote from 'utils/_vote'

import ListingRow from './ListingRow'
import Apply from './Apply'
import Challenge from './Challenge'
import CommitVote from './CommitVote'

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
          _vote.getListingHash(this.state.listingName),
          convertedToBaseUnit(this.state.numTokens, 18),
          this.state.listingName,
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
      networkID,
      miningStatus,
    } = this.props

    const items = [
      <Identicon address={account} diameter={30} />,
      <OverFlowDiv>{`Account: ${account}`}</OverFlowDiv>,
      <div>
        {`Ether Balance: ${withCommas(
          trimDecimalsThree(balances.get('ETH'))
        )} ΞTH`}
      </div>,
      <div>
        {`${token.name} Balance: ${withCommas(
          trimDecimalsThree(balances.get('token'))
        )} ${token.symbol}`}
      </div>,
      <div>{`Network: ${
        networkID === '4'
          ? 'Rinkeby'
          : networkID === '420' ? 'Ganache' : networkID
      }`}</div>,
      <Text color="red" weight="bold">
        {miningStatus && 'MINING'}
      </Text>,
    ]
    const dropDown = (
      <DropDown
        items={items}
        active={this.state.activeItem}
        onChange={this.handleChange}
      />
    )
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
                    <Text>{one.get('data')}</Text>
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
