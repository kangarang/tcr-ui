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

import {
  AppBar,
  AppBarWrapper,
  MarginDiv,
  OverFlowDiv,
  HomeWrapper,
  CMItem,
  FileInput,
} from 'components/StyledHome'

import { SideSplit, SideText } from 'components/Transaction'
import translate from 'translations'
import { jsonTheme } from '../../colors'

import Identicon from 'components/Identicon'
import ListingRow from '../Home/ListingRow'
// import SideTextInput from './components/SideTextInput'


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
  baseToConvertedUnit,
  convertedToBaseUnit,
  withCommas,
  BN,
  trimDecimalsThree,
} from '../../utils/_unit'
import _vote from '../../utils/_vote'
import { dateHasPassed } from '../../utils/format-date'

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      opened: false,
      selectedOne: false,
      revealedVote: false,
      methodName: false,
      visibleApprove: false,
      miningStatus: false,
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
    // this.props.onCloseSidePanel()
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
      : methodName === 'approve'
        ? [
            this.props[contract].address,
            convertedToBaseUnit(this.state.numTokens, 18),
          ]
        : methodName === 'requestVotingRights' ? [this.state.numTokens] : false
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
      account,
      networkID,
      balances,
      parameters,
      registry,
      token,
      miningStatus,
    } = this.props

    return (
      <div>
        {/* TODO: test */}
        <AppBarWrapper>
          {error ? (
            <AppBar>
              <div>{error.message}</div>
            </AppBar>
          ) : (
            <AppBar>
              <div>{registry.name}</div>

              <div>{`Network: ${
                networkID === '4'
                  ? 'Rinkeby'
                  : networkID === '420' ? 'Ganache' : networkID
              }`}</div>

              <Identicon address={account} diameter={30} />

              <Text color="red" weight="bold">
                {miningStatus && 'MINING'}
              </Text>

              <OverFlowDiv>{`Account: ${account}`}</OverFlowDiv>
              <div>
                {`Ether Balance: ${withCommas(
                  trimDecimalsThree(balances.get('ETH'))
                )} ΞTH`}
              </div>
              <div>
                {`${token.name} Balance: ${withCommas(
                  trimDecimalsThree(balances.get('token'))
                )} ${token.symbol}`}
              </div>
            </AppBar>
          )}
        </AppBarWrapper>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSetupEthereum: network => dispatch(setupEthereum(network)),
    onSendTransaction: payload => dispatch(sendTransaction(payload)),
  }
}

const mapStateToProps = createStructuredSelector({
  error: selectError,
  account: selectAccount,
  networkID: selectNetworkID,
  balances: selectBalances,
  token: selectToken,
  registry: selectRegistry,
  parameters: selectParameters,
  miningStatus: selectMiningStatus,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect)(Header)
