import React from 'react'
import { config } from '../config'

import Identicon from './Identicon'
import Img from './Img'

import {
  Container,
  Item,
  FlexCenteredItem,
  BoldInlineText,
  BigBoldInlineText,
} from './Item'

import { toEther, withCommas, trimDecimalsThree } from '../utils/units_utils'

import iconSrc from '../assets/icons/corva.png'

export default ({ account, networkID, balances, parameters, token }) => (
  <Container>
    <FlexCenteredItem gR={1} gC={1}>
      <Img src={iconSrc} alt="" />
    </FlexCenteredItem>

    <Item gR={1} gC={2}>
      <BigBoldInlineText>{`${config.name} Registry`}</BigBoldInlineText>
    </Item>

    <Item gR={1} gC={3}>
      <BoldInlineText>
        {'Network: '}
        {networkID}
      </BoldInlineText>
    </Item>

    <Item gR={1} gC={4}>
      <BoldInlineText>
        {'ΞTH Balance: '}
        {withCommas(trimDecimalsThree(toEther(balances.ETH)))}
      </BoldInlineText>
    </Item>

    <FlexCenteredItem gR={2} gC={1}>
      <Identicon address={account} diameter={40} />
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
        {token.name && token.name}
      </BoldInlineText>
    </Item>

    <Item gR={2} gC={4}>
      <BoldInlineText>
        {`${token.symbol ? token.symbol: ''} Balance: `}
        {balances.token && withCommas(trimDecimalsThree(balances.token))}
      </BoldInlineText>
    </Item>
  </Container>
)
