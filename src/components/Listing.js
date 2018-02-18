import React from 'react'
import styled from 'styled-components'

import Button from './Button'
import A from './A'
import Identicon from './Identicon'

import {
  Item,
  FlexCenteredItem,
  BoldInlineText,
  BigBoldInlineText,
} from './Item'

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 5fr 4fr 4fr 5fr;
  grid-gap: 15px;
  padding: 0.7em;
  border: 2px solid #${props => props.txHash && props.txHash.slice(-6)};
  border-radius: 4px;
`

export default ({ latest, owner, listing, whitelisted, handleClick }) => (
  <Container txHash={latest.get('txHash')}>
    <FlexCenteredItem gC={1}>
      <Identicon owner={owner} size={6} scale={6} />
    </FlexCenteredItem>

    <Item gC={2}>
      <BigBoldInlineText>{listing}</BigBoldInlineText>
    </Item>

    <Item gC={3}>
      <BoldInlineText>
        {'Applicant: '}
        <A
          target="_blank"
          href={`https://rinkeby.etherscan.io/address/${owner}`}
        >
          {owner}
        </A>
      </BoldInlineText>
    </Item>

    <Item gC={4}>
      <BoldInlineText>
        {latest.get('pollID') && (
          <span>
            {'Challenger: '}
            <A
              target="_blank"
              href={`https://rinkeby.etherscan.io/address/${latest.get(
                'sender'
              )}`}
            >
              {latest.get('sender')}
            </A>
          </span>
        )}
      </BoldInlineText>
    </Item>

    {latest.get('numTokens') && (
      <Item gC={3}>
        <BoldInlineText>
          {'Deposit: '}
          {latest.get('numTokens').toString(10)}
        </BoldInlineText>
      </Item>
    )}

    <Item gC={4}>
      <BoldInlineText>
        {latest.get('appExpired')
          ? 'UPDATE STATUS ->'
          : `${'App Expiry:'} ${latest.getIn(['appExpiry', 'formattedLocal'])}`}
        {/* {'Block number: '}
        {latest.get('blockNumber')} */}
      </BoldInlineText>
    </Item>

    <Item gC={5}>
      {/* unchallenged. not expired */}
      {!latest.get('pollID') && !latest.get('appExpired') && (
        <Button
          onClick={e =>
            handleClick({ method: 'challenge', context: { listing, latest } })
          }
        >
          {'Challenge'}
        </Button>
      )}
      {/* unchallenged. expired */}
      {!latest.get('pollID') && latest.get('appExpired') && (
        <Button
          onClick={e =>
            handleClick({ method: 'updateStatus', context: { listing, latest } })
          }
        >
          {'Update Status'}
        </Button>
      )}
      <BoldInlineText>
        {whitelisted ? (
          'Whitelisted on block number: ' + latest.get('blockNumber')
        ) : latest.get('event') === '_Challenge' ? ( // account for reveal period expiry
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
            {'Commit Vote'}
          </Button>
        ) : ''}
      </BoldInlineText>
    </Item>

    {/* 
    <Item gC={6}>
      <BoldInlineText>
        {'Transaction: '}
        <A
          target={'_blank'}
          href={`https://rinkeby.etherscan.io/tx/${latest.get('txHash')}`}
        >
          {latest.get('txHash')}
        </A>
      </BoldInlineText>
    </Item> */}
  </Container>
)
