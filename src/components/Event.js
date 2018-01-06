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
  golem,
  owner,
  domain,

  handleClickChallenge,
  handleClickCommitVote,
  handleClickUpdateStatus,
  handleClickTest,
}) => (
    <Container txHash={golem.getIn(['transaction', 'txHash'])}>
      <FlexCenteredItem gR={1} gC={1}>
        <Identicon owner={golem.get('owner')} size={6} scale={6} />
      </FlexCenteredItem>

      {golem.get('whitelisted') && (
        <FlexCenteredItem gR={1} gC={1}>
          <Img src={catIcon} alt="" />
        </FlexCenteredItem>
      )}

      <Item pad={0.5} gR={1} gC={2}>
        <BigBoldInlineText>
          {golem.get('whitelisted') ? 'Member: ' : 'Candidate: '}
          {domain}
        </BigBoldInlineText>
      </Item>

      {golem.getIn(['transaction', 'numTokens']) && (
        <Item pad={0.5} gR={1} gC={3}>
          <BoldInlineText>
            {'Deposit: '}
            {golem.getIn(['transaction', 'numTokens']).toString(10)}
            {' CATT'}
          </BoldInlineText>
        </Item>
      )}

      <Item pad={0.5} gR={1} gC={4} >
        {!golem.getIn(['transaction', 'pollID']) && (
          <Button onClick={e => handleClickChallenge(e, domain)}>{'Challenge'}</Button>
        )}
        {(!golem.get('whitelisted') && golem.getIn(['transaction', 'pollID'])) && (
          <Button onClick={e => handleClickCommitVote(e, domain, golem.getIn(['transaction', 'pollID']))}>
            {'Commit Vote'}
          </Button>
        )}
        {(!golem.get('whitelisted') && golem.get('canBeWhitelisted')) && (
          <Button onClick={e => handleClickUpdateStatus(e, domain)}>{'Update membership status'}</Button>
        )}
        <Button onClick={e => handleClickTest(e, domain)}>{'Test'}</Button>
      </Item>

      <Item pad={0.5} gR={2} gC={2}>
        <BoldInlineText>
          {'Block number: '}
          {golem.get('blockNumber')}
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
          <A target={'_blank'} href={`https://rinkeby.etherscan.io/tx/${golem.get('txHash')}`}>
            {golem.get('txHash')}
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