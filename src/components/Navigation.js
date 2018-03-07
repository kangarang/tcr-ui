import React, { Component } from 'react'

import { AppBar, AppBarWrapper, OverFlowDiv } from './StyledHome'

import { Button, Text, DropDown } from '@aragon/ui'

import Identicon from 'components/Identicon'

import { withCommas, trimDecimalsThree } from 'utils/units_utils'

export default class Navigation extends Component {
  constructor() {
    super()
    this.state = {
      activeItem: 0,
    }
  }

  handleChange(index) {
    this.setState({ activeItem: index })
  }

  render() {
    const {
      error,
      registry,
      networkID,
      account,
      miningStatus,
      balances,
      token,
      openSidePanel,
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
    return (
      <AppBarWrapper>
        {error ? (
          <AppBar>
            <div>{error.message}</div>
          </AppBar>
        ) : (
          <AppBar>
            <Button mode="strong" onClick={openSidePanel}>
              {'Start an application'}
            </Button>

            <div>{registry.name}</div>

            <DropDown
              items={items}
              active={this.state.activeItem}
              onChange={this.handleChange}
            />
          </AppBar>
        )}
      </AppBarWrapper>
    )
  }
}
