import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Identicon from '../Identicon'
import Button from '../Button'

import Img from '../Img'

import {
  toEther,
  withCommas,
  trimDecimalsThree,
} from '../../libs/units'

import guccIcon from '../../assets/icons/gucci.jpg'

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 7fr 8fr 6fr;
  grid-template-rows: 1fr 1fr;
  /* grid-auto-rows: minmax(100px, auto); */
  grid-gap: 10px;
  /* border: 1px solid black; */
  padding: 1em;
  /* overflow: hidden; */
  background-color: rgba(0, 0, 0, 0.2);
  color: #222;
`
const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start
  /* border: 1px solid red; */
  grid-row: ${(props) => props.gR};
  grid-column: ${(props) => props.gC};
`
const FlexCenteredItem = styled(Item)`
  justify-content: center;
`
const Text = styled.div`
  height: 24px;
  display: block;
  margin: 1em;
`
const InlineText = styled(Text)`
  display: inline;
`
const BoldInlineText = styled(InlineText)`
  font-weight: bold;
`
const BigBoldInlineText = styled(BoldInlineText)`
  font-size: 1.3em;
`

function UserInfo({
  account,
  ethBalance,
  network,
  tokenBalance,
  tokensAllowed,
  onApprove,
}) {
  return (
    <Container>
      <FlexCenteredItem gR={1} gC={1}>
        <Img src={guccIcon} alt="" />
      </FlexCenteredItem>

      <Item gR={1} gC={2}>
        <BigBoldInlineText>{'Gucci Gang Tryouts'}</BigBoldInlineText>
      </Item>

      <Item gR={1} gC={3}>
        <BoldInlineText>
          {'ΞTH Balance: '}
          {trimDecimalsThree(toEther(ethBalance))}
        </BoldInlineText>
      </Item>

      <Item gR={1} gC={4}>
        <BoldInlineText>
          {'GUCC Balance: '}
          {withCommas(tokenBalance)}
        </BoldInlineText>
      </Item>

      <FlexCenteredItem gR={2} gC={1}>
        <Identicon account={account} size={6} scale={6} />
      </FlexCenteredItem>

      <Item gR={2} gC={2}>
        <BoldInlineText>
          {'Account: '}
          {account}
        </BoldInlineText>
      </Item>

      <Item gR={2} gC={3}>
        <BoldInlineText>
          {'Network: '}
          {network === '5777'
            ? 'Ganache'
            : network === '4'
              ? 'Rinkeby'
              : network === '1' ? 'Main' : 'Unknown'}
        </BoldInlineText>
      </Item>

      <Item gR={2} gC={4}>
        {tokensAllowed < 50000 ? (
          <Button onClick={onApprove}>{'Approve(1,000,000)'}</Button>
        ) : (
          <BoldInlineText>
            {'GUC Allowed: '}
            {withCommas(tokensAllowed)}
          </BoldInlineText>
        )}
      </Item>
    </Container>
  )
}

UserInfo.propTypes = {
  account: PropTypes.string,
  network: PropTypes.string,
  onApprove: PropTypes.func,
  tokenBalance: PropTypes.string,
  tokensAllowed: PropTypes.string,
  ethBalance: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
}

export default UserInfo
