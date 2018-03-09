import react, { Component } from 'react'

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
import Identicon from 'components/Identicon'
import {
  MarginDiv,
  HomeWrapper,
  CMItem,
  FileInput,
  OverFlowDiv,
} from 'components/StyledHome'

class Stats extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeItem: 0,
    }
  }
  handleChange(index) {
    this.setState({ activeItem: index })
  }
  render() {
    const {
      account,
      candidates,
      faceoffs,
      whitelist,
      balances,
      contracts,
      network,
      miningStatus,
    } = this.props

    const ethBalance = `${withCommas(
      trimDecimalsThree(balances.get('ETH'))
    )} ΞTH`

    const tokenBalance = `${withCommas(
      trimDecimalsThree(balances.get('token'))
    )} ${contracts.get('tokenSymbol')}`

    const items = [
      <Identicon address={account} diameter={30} />,
      <OverFlowDiv>{`Account: ${account}`}</OverFlowDiv>,
      <div>{network}</div>,
      <div>{ethBalance}</div>,
      <div>{tokenBalance}</div>,
      <Text color="red" weight="bold">
        {miningStatus && 'MINING'}
      </Text>,
    ]

    return (
      <div>
        <div>{`${candidates.size}`}</div>
        <div>{`${faceoffs.size}`}</div>
        <div>{`${whitelist.size}`}</div>
        <div>
          <div>{network}</div>
          <div>{ethBalance}</div>
          <div>{tokenBalance}</div>
          <DropDown
            items={items}
            active={this.state.activeItem}
            onChange={this.handleChange}
          />
        </div>
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

export default compose(withConnect)(Stats)
