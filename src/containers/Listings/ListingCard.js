import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'

import Button from 'components/Button'
import Img from 'components/Img'
import Countdown from 'components/Countdown'

import imgSrc from 'assets/icons/eth.png'
import styled from 'styled-components'

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
    height: 170,
    margin: 15,
  },
  buttContainer: {},
}

function ListingCard(props) {
  const {
    one,
    classes,
    tokenData,
    listingType,
    updateTrigger,
    revealTrigger,
    openSidePanel,
    claimRewardTrigger,
  } = props

  return (
    <div>
      <Card className={classes.card}>
        <div className={classes.media}>
          <Img src={tokenData && tokenData.imgSrc ? tokenData.imgSrc : imgSrc} alt="" />
        </div>

        <CardContent>
          <Typography variant="title" component="h3">
            {tokenData && tokenData.name
              ? tokenData.name
              : one.listingID && one.listingID}
          </Typography>

          <PadDiv className={classes.buttContainer}>
            <Typography component="p">
              <a
                target="_blank"
                href={`https://gateway.ipfs.io/ipfs/${one.data}`}
              >{`More info`}</a>
            </Typography>
            <Typography component="p">
              {`Block: ${one.blockNumber.toString()}`}
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
                    onClick={e => openSidePanel(one, 'commitVote')}
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
                      onClick={e => openSidePanel(one, 'revealVote')}
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
                onClick={e => openSidePanel(one, 'challenge')}
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
              onClick={e => openSidePanel(one, 'claimReward')}
              color="primary"
            >
              {'Claim Reward'}
            </Button>
          )}
          {updateTrigger && (
            <Button
              methodName="updateStatus"
              onClick={e => openSidePanel(one, 'updateStatus')}
              color="primary"
            >
              {'Update Status'}
            </Button>
          )}
        </ButtonContainer>
      </Card>
    </div>
  )
}

export default withStyles(styles)(ListingCard)
