import React from 'react'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Card from 'material-ui/Card'

import Button from 'views/components/Button'
import Img from 'views/components/Img'
import Countdown from 'views/components/Countdown'

import imgSrc from 'views/assets/icons/eth.png'
import styled from 'styled-components'

const CardContent = styled.div`
  padding: 1em;
`
const PadDiv = styled.div`
  padding-top: 1em;
`
const ButtonContainer = styled.div`
  position: absolute;
  bottom: 0;
  margin-bottom: 10px;
`

const styles = {
  card: {
    width: 180,
    height: 420,
    margin: 10,
    padding: '.5em',
    overflow: 'hidden',
    borderRadius: 5,
    position: 'relative',
  },
  media: {
    height: 180,
  },
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
  } = props

  return (
    <div>
      <Card className={classes.card}>
        <div className={classes.media}>
          <Img
            src={tokenData && tokenData.get('imgSrc') ? tokenData.get('imgSrc') : imgSrc}
            alt=""
          />
        </div>

        <CardContent>
          <Typography variant="title" component="h3">
            {tokenData && tokenData.get('name')
              ? tokenData.get('name')
              : one.get('listingID') && one.get('listingID')}
          </Typography>

          <PadDiv>
            <Typography component="p">
              <a
                target="_blank"
                href={`https://gateway.ipfs.io/ipfs/${one.get('data')}`}
              >{`More info`}</a>
            </Typography>
            <Typography component="p">
              {`Block: ${one.get('blockNumber').toString()}`}
            </Typography>
          </PadDiv>
        </CardContent>

        <ButtonContainer>
          {listingType === 'faceoffs' ? (
            <div>
              {!revealTrigger && !updateTrigger ? (
                <div>
                  <Button
                    methodName="commitVote"
                    onClick={e => openSidePanel(one, 'commitVote')}
                    color="primary"
                  >
                    {'Commit Vote'}
                  </Button>
                  <Countdown end={one.getIn(['commitExpiry', 'date'])} />
                </div>
              ) : (
                revealTrigger &&
                !updateTrigger && (
                  <div>
                    <Button
                      onClick={e => openSidePanel(one, 'revealVote')}
                      color="primary"
                      methodName="revealVote"
                    >
                      {'Reveal Vote'}
                    </Button>
                    <Countdown end={one.getIn(['revealExpiry', 'date'])} />
                  </div>
                )
              )}
            </div>
          ) : (
            <div>
              <Button
                wide
                onClick={e => openSidePanel(one, 'challenge')}
                color="secondary"
                methodName="challenge"
              >
                {'Challenge'}
              </Button>
              <Countdown end={one.getIn(['appExpiry', 'date'])} />
            </div>
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
