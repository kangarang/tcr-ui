import React from 'react'
import styled from 'styled-components'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'

import Button from 'components/Button'
import Img from 'components/Img'
import Countdown from 'components/Countdown'

import { tsToMonthDate } from 'utils/_datetime'

const CardContent = styled.div`
  padding: 1em;
`
const PadDiv = styled.div`
  padding-top: 0.5em;
`
const ButtonContainer = styled.div`
  position: absolute;
  bottom: 0;
  margin-bottom: 10px;
`

const styles = {
  card: {
    width: 170,
    height: 400,
    margin: 15,
    padding: '.5em',
    overflow: 'hidden',
    borderRadius: 5,
    position: 'relative',
  },
  media: {
    height: 40,
    margin: 15,
  },
  content: {
    height: 100,
  },
  buttContainer: {},
}

function ListingCard(props) {
  const {
    one,
    classes,
    listingType,
    updateTrigger,
    revealTrigger,
    openTxPanel,
    claimRewardTrigger,
  } = props

  return (
    <div>
      <Card className={classes.card}>
        <div className={classes.media}>
          <h2>{one.listingID}</h2>
        </div>

        <CardContent className={classes.content}>
          {one.data.startsWith('http') ? (
            <Img alt="listing data" src={one.data} />
          ) : (
            <div>{one.data}</div>
          )}
          <PadDiv className={classes.buttContainer}>
            <Typography component="p">
              {tsToMonthDate(
                one.whitelistBlockTimestamp
                  ? one.whitelistBlockTimestamp
                  : one.latestBlockTxn.blockTimestamp
              )}
            </Typography>
          </PadDiv>
        </CardContent>

        <ButtonContainer>
          {listingType === 'faceoffs' ? (
            <div>
              {!revealTrigger && !updateTrigger ? (
                <div>
                  <Countdown end={one.commitExpiry.date} />
                  <Button
                    methodName="commitVote"
                    onClick={e => openTxPanel(one, 'commitVote')}
                    color="primary"
                  >
                    {'Commit Vote'}
                  </Button>
                </div>
              ) : (
                revealTrigger &&
                !updateTrigger && (
                  <div>
                    <Countdown end={one.revealExpiry.date} />
                    <Button
                      onClick={e => openTxPanel(one, 'revealVote')}
                      color="primary"
                      methodName="revealVote"
                    >
                      {'Reveal Vote'}
                    </Button>
                  </div>
                )
              )}
            </div>
          ) : (
            <div>
              <Countdown end={one.appExpiry.date} />
              <Button
                wide
                onClick={e => openTxPanel(one, 'challenge')}
                color="secondary"
                methodName="challenge"
              >
                {'Challenge'}
              </Button>
            </div>
          )}
          {claimRewardTrigger && (
            <Button
              methodName="claimReward"
              onClick={e => openTxPanel(one, 'claimReward')}
              color="primary"
            >
              {'Claim Reward'}
            </Button>
          )}
          {updateTrigger && (
            <Button
              methodName="updateStatus"
              onClick={e => openTxPanel(one, 'updateStatus')}
              color="primary"
              wide
            >
              {'Refresh'}
            </Button>
          )}
        </ButtonContainer>
      </Card>
    </div>
  )
}

export default withStyles(styles)(ListingCard)
