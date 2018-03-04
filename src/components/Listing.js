import React from 'react'
import styled from 'styled-components'

import Button from './Button'

import { BoldInlineText, InlineText } from './Item'
import { colors } from '../colors'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 1em;
  border: 2px solid #${props => props.txHash && props.txHash.slice(-6)};
  border-radius: 4px;
`

const FileInput = styled.input`
  padding: 1em;
  border: 2px solid ${colors.prism};
`

export default ({
  log,
  latest,
  owner,
  listingString,
  whitelisted,
  handleClick,
  onFileInput,
}) => (
  <Container txHash={latest.get('txHash')}>
    {/* <FlexCenteredItem gC={1}>
      <Identicon owner={owner} size={6} scale={6} />
    </FlexCenteredItem> */}

    <div>
      {'Listing: '}
      {listingString}
    </div>
    <div>
      {'Owner: '}
      {owner}
    </div>

    {latest.get('pollID') && (
      <div>
        {'Challenger: '}
        {latest.get('sender')}
      </div>
    )}

    {latest.get('numTokens') && (
      <div>
        {'Deposit: '}
        {latest.get('numTokens').toString(10)}
      </div>
    )}

    <div>
      {'App Expiry: '}
      {latest.getIn(['appExpiry', 'formattedLocal'])}
    </div>

    {latest.getIn(['appExpiry', 'timeleft']) > 0 && (
      <div>
        {'Application Expiry: '}
        {latest.getIn(['appExpiry', 'timeleft'])}
        {' Seconds'}
      </div>
    )}
    {latest.getIn(['commitExpiry', 'timeleft']) > 0 && (
      <div>
        {'Commit Period End: '}
        {latest.getIn(['commitExpiry', 'timeleft'])}
        {' Seconds'}
      </div>
    )}
    {latest.getIn(['revealExpiry', 'timeleft']) > 0 && (
      <div>
        {'Reveal Period End: '}
        {latest.getIn(['revealExpiry', 'timeleft'])}
        {' Seconds'}
      </div>
    )}

    <div>
      {/* unchallenged. not expired */}
      {(!latest.get('pollID') && !latest.get('appExpired')) || whitelisted ? (
        <Button
          onClick={e =>
            handleClick({
              method: 'challenge',
              context: { listing: listingString, latest },
            })
          }
        >
          {'Challenge'}
        </Button>
      ) : (
        false
      )}

      {/* unchallenged. expired */}
      {!whitelisted &&
        !latest.get('pollID') &&
        latest.get('appExpired') && (
          <Button
            onClick={e =>
              handleClick({
                method: 'updateStatus',
                context: { listing: listingString, latest },
              })
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
                  listing: listingString,
                  latest,
                },
              })
            }
          >
            {'Commit Vote'}
          </Button>
        ) : (
          ''
        )}
      </BoldInlineText>

      <InlineText>
        {latest.getIn(['revealExpiry', 'timeleft']) > 0 && (
          <FileInput type="file" name="file" onChange={onFileInput} />
        )}
      </InlineText>
    </div>
  </Container>
)
