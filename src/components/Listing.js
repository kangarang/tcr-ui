import React from 'react'
import styled from 'styled-components'

import favicon from '../assets/icons/favicon.ico'

import A from './A'
import Button from './Button'
import Identicon from './Identicon'
import Img from './Img'

import { Item, FlexCenteredItem, BoldInlineText, BigBoldInlineText } from './Item'

const Container = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 3fr 6fr 8fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 15px;
  padding: 0.7em;
  border: 2px solid #${props => props.txHash && props.txHash.slice(-6)};
  border-radius: 4px;
`

export default ({ latest, owner, listing, whitelisted, handleClick }) => (
  <Container txHash={latest.get('txHash')}>
    <FlexCenteredItem gR={1} gC={1}>
      <Identicon owner={latest.get('txHash')} size={6} scale={6} />
    </FlexCenteredItem>

    <FlexCenteredItem gR={whitelisted ? 1 : 2} gC={1}>
      <Img src={favicon} alt="" />
    </FlexCenteredItem>

    <Item gR={1} gC={2}>
      <BigBoldInlineText>{listing}</BigBoldInlineText>
    </Item>

    {latest.get('numTokens') && (
      <Item gR={1} gC={3}>
        <BoldInlineText>
          {'Deposit: '}
          {latest.get('numTokens').toString(10)}
        </BoldInlineText>
      </Item>
    )}

    <Item gR={1} gC={4}>
      {!latest.get('pollID') && (
        <Button
          onClick={e =>
            handleClick({ method: 'challenge', context: { listing, latest } })
          }
        >
          {'Challenge'}
        </Button>
      )}
      <BoldInlineText>
        {!latest.get('pollID') && !whitelisted ? (
          'This listing has not been challenged yet'
        ) : whitelisted ? (
          'Whitelisted on block number: ' + latest.get('blockNumber')
        ) : latest.get('event') === '_Challenge' ? (
          <Button
            onClick={e =>
              handleClick({
                method: 'commitVote',
                context: {
                  listing,
                  latest,
                },
              })
            }
          >
            {'Commit Vote for Poll: ' + latest.get('pollID')}
          </Button>
        ) : (
          ''
        )}
      </BoldInlineText>
    </Item>

    <Item gR={2} gC={2}>
      <BoldInlineText>
        {'Block number: '}
        {latest.get('blockNumber')}
      </BoldInlineText>
    </Item>

    <Item gR={2} gC={3}>
      <BoldInlineText>
        {'Applicant address: '}
        <A target="_blank" href={`https://rinkeby.etherscan.io/address/${owner}`}>
          {owner}
        </A>
        <br />
        <br />
        {latest.get('pollID') && 'Challenger: ' + latest.get('sender')}
      </BoldInlineText>
    </Item>

    <Item gR={2} gC={4}>
      <BoldInlineText>
        {'Transaction: '}
        <A
          target={'_blank'}
          href={`https://rinkeby.etherscan.io/tx/${latest.get('txHash')}`}
        >
          {latest.get('txHash')}
        </A>
      </BoldInlineText>
    </Item>
  </Container>
)
