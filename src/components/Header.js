import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'

import toJS from 'components/toJS'
import Img from 'components/Img'
import Identicon from 'components/Identicon'

import {
  selectError,
  selectAccount,
  selectNetwork,
  selectBalances,
  selectTCR,
} from 'modules/home/selectors'
import { selectRegistryStart } from 'modules/home/actions'
import { openSidePanel } from 'modules/transactions/actions'

import { trimDecimalsThree } from 'libs/units'
import dropDownCaratIconSrc from 'assets/icons/down-arrow.svg'
// import avatarIconSrc from 'assets/icons/eth.png'
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
  display: flex;
  align-items: center;
  width: 40px;
  margin-right: 0.4em;
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
class Header extends Component {
  handleDropdown() {
    console.log('clicked dropdown')
  }

  render() {
    const {
      tcr,
      account,
      balances,
      onHandleToggleRegistries,
      onOpenSidePanel,
    } = this.props

    return (
      <HeaderWrapper>
        <PageTitle>{tcr.registryName}</PageTitle>

        <NavWrapper>
          <NavLinks>
            <NavLink onClick={onHandleToggleRegistries}>Registries</NavLink>
            <NavLink onClick={e => onOpenSidePanel(null, 'apply')}>
              Add an application
            </NavLink>
            <NavLink>Vote</NavLink>
            <NavLink>How does this work?</NavLink>
          </NavLinks>

          <UserInfo>
            <Avatar>
              <Identicon address={account} diameter={30} />
            </Avatar>

            <Balances>
              <TokenBalance onClick={() => onOpenSidePanel(null, 'transfer')}>
                {balances.token} {tcr.tokenSymbol}
              </TokenBalance>
              <EtherBalance>0.00 USD {trimDecimalsThree(balances.ETH)} ETH</EtherBalance>
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
const mapStateToProps = createStructuredSelector({
  error: selectError,
  network: selectNetwork,
  tcr: selectTCR,
  account: selectAccount,
  balances: selectBalances,
})

function mapDispatchToProps(dispatch) {
  return {
    onSelectRegistry: tcr => dispatch(selectRegistryStart(tcr)),
    onOpenSidePanel: (selectedOne, methodName) =>
      dispatch(openSidePanel(selectedOne, methodName)),
  }
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)

export default compose(withConnect)(toJS(Header))
