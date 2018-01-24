import React from 'react'
import PropTypes from 'prop-types'

import { config } from '../../config'

import Identicon from '../Identicon'
// import Button from '../Button'
import Img from '../Img'

import {
  Container,
  Item,
  FlexCenteredItem,
  BoldInlineText,
  BigBoldInlineText,
} from '../Item'

import { toEther, withCommas, trimDecimalsThree } from '../../libs/units'

import iconSrc from '../../assets/icons/favicon.ico'

function UserInfo({ account, wallet, contracts, error, onSelectNetwork }) {
  return (
    <Container>
      <FlexCenteredItem gR={1} gC={1}>
        <Img src={iconSrc} alt="" />
      </FlexCenteredItem>

      <Item gR={1} gC={2}>
        <BigBoldInlineText>{`${config.spokeName} Registry`}</BigBoldInlineText>
      </Item>

      <Item gR={1} gC={3}>
        <BoldInlineText>
          {'ΞTH Balance: '}
          {trimDecimalsThree(toEther(wallet.get('ethBalance')))}
        </BoldInlineText>
      </Item>

      <Item gR={1} gC={4}>
        <BoldInlineText>
          {`${wallet.getIn(['token', 'tokenSymbol'])} Balance: `}
          {wallet.getIn(['token', 'tokenBalance']) &&
            withCommas(wallet.getIn(['token', 'tokenBalance']))}
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

      <Item gR={2} gC={3}>
        <BoldInlineText>
          {'Network: '}
          {wallet.get('network')}
          {/* {wallet.get('network') === '5777'
            ? 'Ganache'
            : wallet.get('network') === '420'
              ? 'Test'
              : wallet.get('network') === '4'
                ? 'Rinkeby'
                : wallet.get('network') === '1'
                  ? 'Main'
                  : wallet.get('network')} */}
        </BoldInlineText>
      </Item>

      <Item gR={2} gC={4}>
        <BoldInlineText>
          {`Registry allowance:`}
          {wallet.getIn([
            'token',
            'allowances',
            contracts.getIn(['registry', 'address']),
            'total',
          ]) &&
            withCommas(
              wallet.getIn([
                'token',
                'allowances',
                contracts.getIn(['registry', 'address']),
                'total',
              ])
            )}
        </BoldInlineText>
      </Item>

      <Item gR={3} gC={4}>
        <BoldInlineText>
          {'Voting allowance: '}
          {wallet.getIn([
            'token',
            'allowances',
            contracts.getIn(['voting', 'address']),
            'total',
          ]) &&
            withCommas(
              wallet.getIn([
                'token',
                'allowances',
                contracts.getIn(['voting', 'address']),
                'total',
              ])
            )}
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
