import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'

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
import { withCommas, trimDecimalsThree } from '../../utils/_values'
import styled from 'styled-components'
import { colors } from '../../global-styles'

class Stats extends Component {
  state = {
    activeItem: 0,
  }
  handleChange = index => {
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
      <div>{`Account: ${account}`}</div>,
      <div>{network}</div>,
      <div>{ethBalance}</div>,
      <div>{tokenBalance}</div>,
    ]

    return (
      <StatsContainer>
        <StatsItem>{`TOTAL APPLICATIONS ${candidates.size}`}</StatsItem>
        <StatsItem>{`TOTAL CHALLENGES ${faceoffs.size}`}</StatsItem>
        <StatsItem>{`TOTAL REGISTERED ${whitelist.size}`}</StatsItem>
        <UserInfo>
          <UserItem>{network}</UserItem>
          <UserItem>{ethBalance}</UserItem>
          <UserItem>{tokenBalance}</UserItem>
          <DropDown
            items={items}
            active={this.state.activeItem}
            onChange={this.handleChange}
          />
        </UserInfo>
      </StatsContainer>
    )
  }
}

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5em;
  background-color: white;
  color: ${colors.offBlack};
  border: 1px solid black;
`
const StatsItem = styled.div`
  padding: 0 1em;
  border-right: 1px solid black;
  font-size: 1.2em;
`
const UserInfo = styled.div`
  display: flex;
`
const UserItem = styled.div``

export default Stats
