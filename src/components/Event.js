import React from 'react'

import styled from 'styled-components'
import PropTypes from 'prop-types'

import Identicon from './Identicon'
import Button from './Button'

import Img from './Img'
import A from './A'

import guccIcon from '../assets/icons/gucci.jpg'

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 5fr 8fr 6fr;
  grid-template-rows: 1fr 1fr;
  /* grid-auto-rows: minmax(100px, auto); */
  grid-gap: 10px;
  /* border: 2px solid ; */
  border: 2px solid #${props => props.txHash && props.txHash.slice(-6)};
  padding: 2em;
`
const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  /* border: 1px solid black; */
  grid-row: ${props => props.gR};
  grid-column: ${props => props.gC};
  overflow: hidden;
`
const FlexCenteredItem = styled(Item)`
  justify-content: center;
`
const Text = styled.div`
  height: 30px;
  display: block;
  margin: 1em;
`
const InlineText = styled(Text)`
  display: inline;
`
const BoldInlineText = styled(InlineText)`
  font-weight: bold;
  text-align: left;
`

export default ({
  domain,
  value,
  blockHash,
  blockNumber,
  txHash,
  account,
  logIndex,
  event,
  challengeID,
  status,
  buttonClick,
  buttonText,
  whitelisted,
}) => (
  <Container txHash={txHash}>
    <FlexCenteredItem gR={1} gC={1}>
      <Identicon account={account} size={6} scale={6} />
    </FlexCenteredItem>

    {buttonText.includes('Challenge') && (
      <FlexCenteredItem gR={2} gC={1}>
        <Img src={guccIcon} alt="" />
      </FlexCenteredItem>
    )}

    <Item gR={1} gC={2}>
      <BoldInlineText>
        {whitelisted ? 'Member: ' : 'Candidate: '}
        {domain}
      </BoldInlineText>
    </Item>

    {value && (
      <Item gR={1} gC={3}>
        <BoldInlineText>
          {'Deposit: '}
          {value.toString(10)}
          {' GUCC'}
        </BoldInlineText>
      </Item>
    )}

    <Item gR={2} gC={2}>
      <BoldInlineText>
        {'Block number: '}
        {blockNumber}
      </BoldInlineText>
    </Item>

    <Item gR={2} gC={3}>
      <BoldInlineText>
        {'Address: '}
        <A
          target="_blank"
          href={`https://rinkeby.etherscan.io/address/${account}`}
        >
          {account}
        </A>
      </BoldInlineText>
    </Item>

    <Item gR={2} gC={4}>
      <BoldInlineText>
        {'Tx hash: '}
        <A target={'_blank'} href={`https://rinkeby.etherscan.io/tx/${txHash}`}>
          {txHash}
        </A>
      </BoldInlineText>
    </Item>

    {status === 'whitelistable' ? (
      <Button onClick={e => buttonClick(e, domain)}>{buttonText}</Button>
    ) : (
      false
    )}
  </Container>
)

Event.propTypes = {
  txHash: PropTypes.string,
  network: PropTypes.string,
  onApprove: PropTypes.func,
  tokenBalance: PropTypes.string,
  tokensAllowed: PropTypes.string,
  ethBalance: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
}
