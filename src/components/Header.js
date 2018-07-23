import React, { Component } from 'react'
import styled from 'styled-components'

import Img from 'components/Img'
import Identicon from 'components/Identicon'
import dropDownCaratIconSrc from 'assets/icons/down-arrow.svg'
import avatarIconSrc from 'assets/icons/eth.png'

// import Menu from '@material-ui/core/Menu'
// import MenuItem from '@material-ui/core/MenuItem'

// import Text from 'components/Text'
// import Button from 'components/Button'
// import NavBar from 'components/NavBar'
// import Identicon from './Identicon'

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4.5em;
  background-color: white;
  font-family: 'Avenir Next';
`
// left-sid
const PageTitle = styled.div`
  margin-left: 2em;
  font-size: 1.25em;
  font-weight: 700;
`

// links + user info
const NavWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`
const NavLinks = styled.div`
  display: flex;
  flex-flow: row wrap;
  font-size: 0.8em;
  font-weight: 500;
  margin-right: 3em;
`
const NavLink = styled.div`
  margin-left: 3em;
`

// right-most components
const UserInfo = styled.div`
  display: flex;
  margin-right: 1em;
`
const Avatar = styled.div`
  width: 40px;
`
const Balances = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const TokenBalance = styled.div`
  font-size: 1em;
  font-weight: 700;
`
const EtherBalance = styled.div`
  color: grey;
  font-size: 0.7em;
  font-weight: 600;
`
const DropdownCaratIcon = styled.div`
  width: 12px;
  margin: 0 10px;
`
export default class Header extends Component {
  // state = {
  //   anchorEl: null,
  // }

  // handleClick = event => {
  //   this.setState({ anchorEl: event.currentTarget })
  // }

  // handleClose = () => {
  //   this.setState({ anchorEl: null })
  // }

  handleDropdown() {
    console.log('clicked dropdown')
  }

  render() {
    const {
      error,
      tcr,
      network,
      account,
      balances,
      contracts,
      applyListing,
      onHandleToggleRegistries,
    } = this.props
    // const { anchorEl } = this.state

    return (
      <HeaderWrapper>
        <PageTitle>{tcr.registryName}</PageTitle>

        <NavWrapper>
          <NavLinks>
            <NavLink onClick={onHandleToggleRegistries}>Registries</NavLink>
            <NavLink onClick={applyListing}>Add an application</NavLink>
            <NavLink>Vote</NavLink>
            <NavLink>How does this work?</NavLink>
          </NavLinks>

          <UserInfo>
            <Avatar>
              <Identicon address={account} diameter={30} />
            </Avatar>

            <Balances>
              <TokenBalance>
                {balances.token} {tcr.tokenSymbol}
              </TokenBalance>
              <EtherBalance>456 USD 0.72 ETH</EtherBalance>
            </Balances>

            <DropdownCaratIcon onClick={this.handleDropdown}>
              <Img alt="dropdown" src={dropDownCaratIconSrc} />
            </DropdownCaratIcon>
          </UserInfo>
        </NavWrapper>
      </HeaderWrapper>
    )
  }
}

// const Wrapper = styled.div`
//   flex-shrink: 0;
// `
// const GridContainer = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   background-color: white;
//   padding: 0.2em 1em;
// `

// const GridItem = styled.div`
//   font-weight: bold;
// `
// const GridItemF = GridItem.extend`
//   display: flex;
// `

// <Wrapper>
//   <GridContainer>
//     {error ? (
//       <GridItem gc={1}>
//         <div>{''}</div>
//       </GridItem>
//     ) : (
//       <GridItem gc={1}>
//         <Button methodName="apply" onClick={openSidePanel}>
//           {'Start an application'}
//         </Button>
//       </GridItem>
//     )}

//     <GridItemF gc={2} onClick={this.handleClick}>
//       <a
//         target="_blank"
//         href={`https://${
//           network !== 'mainnet' ? network + '.' : ''
//         }etherscan.io/address/${tcr.registryAddress}`}
//       >
//         <Identicon address={tcr.registryAddress} diameter={20} />
//       </a>
//       <Text size="xxlarge" weight="bold">
//         {tcr.registryName}
//       </Text>
//     </GridItemF>

//     <Menu
//       id="simple-menu"
//       anchorEl={anchorEl}
//       open={Boolean(anchorEl)}
//       onClose={this.handleClose}
//     >
//       <a
//         target="_blank"
//         href={`https://rinkeby.etherscan.io/address/${contracts.registry.address}`}
//       >
//         <MenuItem onClick={this.handleClose}>{`Registry: ${
//           contracts.registry.address
//         }`}</MenuItem>
//       </a>
//       <a
//         target="_blank"
//         href={`https://rinkeby.etherscan.io/address/${contracts.voting.address}`}
//       >
//         <MenuItem onClick={this.handleClose}>{`Voting: ${
//           contracts.voting.address
//         }`}</MenuItem>
//       </a>
//       <a
//         target="_blank"
//         href={`https://rinkeby.etherscan.io/address/${contracts.token.address}`}
//       >
//         <MenuItem onClick={this.handleClose}>{`Token: ${
//           contracts.token.address
//         }`}</MenuItem>
//       </a>
//     </Menu>
