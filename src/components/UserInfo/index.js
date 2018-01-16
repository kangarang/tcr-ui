import React from 'react'
import PropTypes from 'prop-types'

import { config } from '../../config'

import Identicon from '../Identicon'
import Button from '../Button'
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

import catIcon from '../../assets/icons/favicon.ico'

function UserInfo({
  account,
  ethBalance,
  network,
  tokenBalance,
  tokensAllowed,
  error,
  onSelectNetwork,
}) {
  return (
    <Container>
      <FlexCenteredItem gR={1} gC={1}>
        <Img src={catIcon} alt="" />
      </FlexCenteredItem>

      <Item gR={1} gC={2}>
        <BigBoldInlineText>{`${config.spoke} Registry`}</BigBoldInlineText>
      </Item>

      <Item gR={1} gC={3}>
        <BoldInlineText>
          {'ΞTH Balance: '}
          {trimDecimalsThree(toEther(ethBalance))}
        </BoldInlineText>
      </Item>

      <Item gR={1} gC={4}>
        <BoldInlineText>
          {`${config.tokenSymbol} Balance: `}
          {withCommas(tokenBalance)}
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
          {network === '5777'
            ? 'Ganache'
            : network === '420'
              ? 'Ganache-CLI'
              : network === '4'
                ? 'Rinkeby'
                : network === '1' ? 'Main'
                  : network || 'Need MetaMask!'}
        </BoldInlineText>
      </Item>

      <Item gR={2} gC={4}>
        <BoldInlineText>
          {`${config.tokenSymbol} Allowed: `}
          {withCommas(tokensAllowed)}
        </BoldInlineText>
      </Item>

    </Container>
  )
}

UserInfo.propTypes = {
  account: PropTypes.string,
  network: PropTypes.string,
  onApprove: PropTypes.func,
  onSelectNetwork: PropTypes.func,
  tokenBalance: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  tokensAllowed: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  ethBalance: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
}

export default UserInfo
