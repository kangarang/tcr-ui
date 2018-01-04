import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import catIcon from '../assets/icons/favicon.ico'

import A from './A'
import Button from './Button'
import Identicon from './Identicon'
import Img from './Img'

import {
  Item,
  FlexCenteredItem,
  BoldInlineText,
  BigBoldInlineText,
} from './Item'

const Container = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 3fr 6fr 8fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 15px;
  /* padding: .7em; */
  border: 2px solid #${props => props.txHash && props.txHash.slice(-6)};
`

export default ({
  blockHash,
  blockNumber,

  txHash,
  txIndex,
  account,

  domain,
  unstakedDeposit,
  pollID,
  logIndex,

  event,
  status,
  whitelisted,
  canBeWhitelisted,

  handleClickChallenge,
  handleClickCommitVote,
  handleClickUpdateStatus,
  handleClickTest,
}) => (
    <Container txHash={txHash}>
      <FlexCenteredItem gR={1} gC={1}>
        <Identicon account={account} size={6} scale={6} />
      </FlexCenteredItem>

      {whitelisted && (
        <FlexCenteredItem gR={1} gC={1}>
          <Img src={catIcon} alt="" />
        </FlexCenteredItem>
      )}

      <Item pad={0.5} gR={1} gC={2}>
        <BigBoldInlineText>
          {whitelisted ? 'Member: ' : 'Candidate: '}
          {domain}
        </BigBoldInlineText>
      </Item>

      {unstakedDeposit && (
        <Item pad={0.5} gR={1} gC={3}>
          <BoldInlineText>
            {'Deposit: '}
            {unstakedDeposit.toString(10)}
            {' CATT'}
          </BoldInlineText>
        </Item>
      )}

      <Item pad={0.5} gR={1} gC={4} >
        {(pollID === false) && (
          <Button onClick={e => handleClickChallenge(e, domain)}>{'Challenge'}</Button>
        )}
        {(!whitelisted && pollID) && (
          <Button onClick={e => handleClickCommitVote(e, domain, pollID)}>{'Commit Vote'}</Button>
        )}
        {(!whitelisted && canBeWhitelisted) && (
          <Button onClick={e => handleClickUpdateStatus(e, domain)}>{'Update membership status'}</Button>
        )}
        <Button onClick={e => handleClickTest(e, domain)}>{'Test'}</Button>
      </Item>

      <Item pad={0.5} gR={2} gC={2}>
        <BoldInlineText>
          {'Block number: '}
          {blockNumber}
        </BoldInlineText>
      </Item>

      <Item pad={0.5} gR={2} gC={3}>
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

      <Item pad={0.5} gR={2} gC={4}>
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