import React, { Component } from 'react'

import { DropDown } from '@aragon/ui'
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
      whitelist,
      balances,
      contracts,
      network,
    } = this.props

    const ethBalance = `${withCommas(
      trimDecimalsThree(balances.get('ETH'))
    )} ΞTH`

    const tokenBalance = `${withCommas(
      trimDecimalsThree(balances.get('token'))
    )} ${contracts.get('tokenSymbol')}`

    const items = [
      <Identicon address={account} diameter={30} />,
      // <div>{`Account: ${account}`}</div>,
      // <div>{network}</div>,
      // <div>{ethBalance}</div>,
      // <div>{tokenBalance}</div>,
    ]

    return (
      <GridContainer>
        <GridItem>
          <CapsDiv>{'total applications'}</CapsDiv>
          <BoldDiv>{candidates.size}</BoldDiv>
        </GridItem>

        <GridItem>
          <CapsDiv>{'total tokens at stake'}</CapsDiv>
          <BoldDiv>{'3500'}</BoldDiv>
        </GridItem>

        <GridItem>
          <CapsDiv>{'listings in registry'}</CapsDiv>
          <BoldDiv>{whitelist.size}</BoldDiv>
        </GridItem>

        <UserInfoGridItem>
          <UserItem>{network}</UserItem>
          <UserItem>{ethBalance}</UserItem>
          <UserItem>{tokenBalance}</UserItem>

          <DropDown
            items={items}
            active={this.state.activeItem}
            onChange={this.handleChange}
          />
        </UserInfoGridItem>
      </GridContainer>
    )
  }
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 9fr 6fr 6fr 11fr;
  grid-column-gap: 2px;
  align-items: center;
  height: 5.5em;
  color: ${colors.offBlack};
  background-color: lightgrey; // grid-line color
  border: 1px solid black;
`
const GridItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  height: 100%;
  padding: 0 2em;
  background-color: white;
`
const CapsDiv = styled.div`
  text-transform: uppercase;
`
const BoldDiv = styled.div`
  color: black;
  font-weight: bold;
`
const UserInfoGridItem = styled(GridItem)`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`
const UserItem = styled.div`
  margin: 1em;
`

export default Stats
