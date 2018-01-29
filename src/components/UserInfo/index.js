import React from 'react'
import PropTypes from 'prop-types'

import { config } from '../../config'

import Identicon from '../Identicon'
import Img from '../Img'

import {
  Container,
  Item,
  FlexCenteredItem,
  BoldInlineText,
  BigBoldInlineText,
} from '../Item'

import {
  toEther,
  withCommas,
  trimDecimalsThree,
} from '../../libs/units'

import iconSrc from '../../assets/icons/favicon.ico'

function UserInfo({ account, wallet, contracts, error, onSelectNetwork }) {
  const tokenBalance = wallet.getIn(['token', 'tokenBalance'])
  const votingRights = wallet.getIn([
    'token',
    'allowances',
    contracts.getIn(['voting', 'address']),
    'votingRights',
  ])
  const votingAllowance = wallet.getIn([
    'token',
    'allowances',
    contracts.getIn(['voting', 'address']),
    'total',
  ])
  const registryAllowance = wallet.getIn([
    'token',
    'allowances',
    contracts.getIn(['registry', 'address']),
    'total',
  ])
  return (
    <Container>
      <FlexCenteredItem gR={1} gC={1}>
        <Img src={iconSrc} alt="" />
      </FlexCenteredItem>

      <Item gR={1} gC={2}>
        <BigBoldInlineText>{`${config.spokeName} Registry`}</BigBoldInlineText>
      </Item>

      <Item gR={4} gC={2}>
        <BoldInlineText>
          {'ΞTH Balance: '}
          {trimDecimalsThree(toEther(wallet.get('ethBalance')))}
        </BoldInlineText>
      </Item>

      <Item gR={1} gC={4}>
        <BoldInlineText>
          {`${wallet.getIn(['token', 'tokenSymbol'])} Balance: `}
          {tokenBalance && withCommas(trimDecimalsThree(tokenBalance))}
        </BoldInlineText>
      </Item>

      <FlexCenteredItem gR={2} gC={1}>
        <Identicon owner={account} size={6} scale={6} />
      </FlexCenteredItem>

      <Item gR={2} gC={2}>
        <BoldInlineText>
          {'Account: '}
          {account || 'You need MetaMask!'}
        </BoldInlineText>
      </Item>

      <Item gR={3} gC={2}>
        <BoldInlineText>
          {'Network: '}
          {wallet.get('network')}
        </BoldInlineText>
      </Item>

      <Item gR={2} gC={3}>
        <BoldInlineText>
          {'Registry: '}
          {contracts.getIn(['registry', 'address'])}
        </BoldInlineText>
      </Item>
      <Item gR={1} gC={3}>
        <BoldInlineText>
          {'Token: '}
          {contracts.getIn(['token', 'address'])}
        </BoldInlineText>
      </Item>
      <Item gR={3} gC={3}>
        <BoldInlineText>
          {'Voting: '}
          {contracts.getIn(['voting', 'address'])}
        </BoldInlineText>
      </Item>

      <Item gR={2} gC={4}>
        <BoldInlineText>
          {`Registry Allowance: `}
          {registryAllowance && withCommas(registryAllowance)}
        </BoldInlineText>
      </Item>

      <Item gR={3} gC={4}>
        <BoldInlineText>
          {'Voting Allowance: '}
          {votingAllowance && withCommas(votingAllowance)}
        </BoldInlineText>
      </Item>

      <Item gR={4} gC={4}>
        <BoldInlineText>
          {'Voting Rights: '}
          {votingRights && withCommas(votingRights)}
        </BoldInlineText>
      </Item>
      <Item gR={5} gC={4}>
        <BoldInlineText>
          {'Voting Balance: '}
          {/* {votingBalance && withCommas(votingBalance)} */}
        </BoldInlineText>
      </Item>
      <Item gR={6} gC={4}>
        <BoldInlineText>
          {'Locked Tokens: '}
          {/* {lockedTokens && withCommas(lockedTokens)} */}
        </BoldInlineText>
      </Item>
    </Container>
  )
}

UserInfo.propTypes = {
  account: PropTypes.string,
  wallet: PropTypes.object,
  onApprove: PropTypes.func,
  onSelectNetwork: PropTypes.func,
}

export default UserInfo
