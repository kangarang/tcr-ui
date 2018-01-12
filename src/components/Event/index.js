import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import catIcon from '../../assets/icons/favicon.ico'

import A from '../A'
import Button from '../Button'
import Identicon from '../Identicon'
import Img from '../Img'

import {
  Item,
  FlexCenteredItem,
  BoldInlineText,
  BigBoldInlineText,
} from '../Item'

const Container = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 3fr 6fr 8fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 15px;
  padding: .7em;
  border: 2px solid #${props => props.txHash && props.txHash.slice(-6)};
  border-radius: 4px;
`

export default ({
  latest,
  owner,
  listing,
  whitelisted,

  handleClickChallenge,
  handleClickCommitVote,
  handleClickUpdateStatus,
}) => (
    <Container txHash={latest.get('txHash')}>
      <FlexCenteredItem gR={1} gC={1}>
        <Identicon owner={latest.get('txHash')} size={6} scale={6} />
      </FlexCenteredItem>

      {whitelisted && (
        <FlexCenteredItem gR={1} gC={1}>
          <Img src={catIcon} alt="" />
        </FlexCenteredItem>
      )}

      <Item pad={0.5} gR={1} gC={2}>
        <BigBoldInlineText>
          {listing}
        </BigBoldInlineText>
      </Item>

      {latest.get('numTokens') && (
        <Item pad={0.5} gR={1} gC={3}>
          <BoldInlineText>
            {'Deposit: '}
            {latest.get('numTokens').toString(10)}
            {' CATT'}
          </BoldInlineText>
        </Item>
      )}

      <Item pad={0.5} gR={1} gC={4} >
        {!latest.get('pollID') && (
          <Button onClick={e => handleClickChallenge(e, listing)}>{'Challenge'}</Button>
        )}
        {(!whitelisted && latest.get('pollID')) && (
          <Button onClick={e => handleClickCommitVote(e, listing, latest.get('pollID'))}>
            {'Commit Vote'}
          </Button>
        )}
        {(!whitelisted && latest.get('canBeWhitelisted')) && (
          <Button onClick={e => handleClickUpdateStatus(e, listing)}>{'Update registry state'}</Button>
        )}
      </Item>

      <Item pad={0.5} gR={2} gC={2}>
        <BoldInlineText>
          {'Block number: '}
          {latest.get('blockNumber')}
        </BoldInlineText>
      </Item>

      <Item pad={0.5} gR={2} gC={3}>
        <BoldInlineText>
          {'Address: '}
          <A
            target="_blank"
            href={`https://rinkeby.etherscan.io/address/${owner}`}
          >
            {owner}
          </A>
        </BoldInlineText>
      </Item>

      <Item pad={0.5} gR={2} gC={4}>
        <BoldInlineText>
          {'Tx hash: '}
          <A target={'_blank'} href={`https://rinkeby.etherscan.io/tx/${latest.get('txHash')}`}>
            {latest.get('txHash')}
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