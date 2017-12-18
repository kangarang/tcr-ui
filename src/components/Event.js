import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import catIcon from '../assets/icons/favicon.ico'

import A from './A'
import Button from './Button'
import Identicon from './Identicon'
import Img from './Img'

const Container = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 4fr 8fr 6fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 5px;
  border: 2px solid #${props => props.txHash && props.txHash.slice(-6)};
  padding: .7em;
`
const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  grid-row: ${props => props.gR};
  grid-column: ${props => props.gC};
  overflow: hidden;
`
const FlexCenteredItem = styled(Item) `
  justify-content: center;
`
const Text = styled.div`
  display: block;
`
const InlineText = styled(Text) `
  display: inline;
`
const BoldInlineText = styled(InlineText) `
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
  handleClickChallenge,
  handleClickUpdateStatus,
  whitelisted,
}) => (
    <Container txHash={txHash}>
      <FlexCenteredItem gR={1} gC={1}>
        <Identicon account={account} size={6} scale={6} />
      </FlexCenteredItem>

      {whitelisted && (
        <FlexCenteredItem gR={2} gC={1}>
          <Img src={catIcon} alt="" />
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
            {' CATT'}
          </BoldInlineText>
        </Item>
      )}

      <Item gR={1} gC={4} >
        {(status === 'challengeable' || status === 'whitelistable') && (
          <Button onClick={e => handleClickChallenge(e, domain)}>{'Challenge'}</Button>
        )}
        {(status === 'whitelistable' && !whitelisted) && (
          <Button onClick={e => handleClickUpdateStatus(e, domain)}>{'Update membership status'}</Button>
        )}
      </Item>

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