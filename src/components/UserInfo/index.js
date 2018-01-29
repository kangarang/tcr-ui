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

import { toEther, withCommas, trimDecimalsThree } from '../../libs/units'

import iconSrc from '../../assets/icons/favicon.ico'

function UserInfo({ account, wallet, contracts, error, onSelectNetwork }) {
  const tokenBalance = wallet.getIn(['token', 'tokenBalance'])
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
          {'Network: '}
          {wallet.get('network')}
        </BoldInlineText>
      </Item>
      <Item gR={1} gC={4}>
        <BoldInlineText>
          {'ΞTH Balance: '}
          {withCommas(trimDecimalsThree(toEther(wallet.get('ethBalance'))))}
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
          {'Token: '}
          {`${wallet.getIn(['token', 'tokenName'])}`}
        </BoldInlineText>
      </Item>
      <Item gR={2} gC={4}>
        <BoldInlineText>
          {`${wallet.getIn(['token', 'tokenSymbol'])} Balance: `}
          {tokenBalance && withCommas(trimDecimalsThree(tokenBalance))}
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
