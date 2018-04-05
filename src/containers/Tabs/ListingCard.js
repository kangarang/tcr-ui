import React from 'react'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Card, { CardActions, CardContent } from 'material-ui/Card'

import Button from 'components/Button'
import Img from 'components/Img'
import Countdown from 'components/Countdown'

import imgSrc from 'assets/icons/eth.png'

const styles = {
  card: {
    width: 240,
    margin: 5,
    padding: '1em',
  },
  media: {
    height: 100,
    margin: 5,
  },
}

function ListingCard(props) {
  const {
    one,
    classes,
    openSidePanel,
    chooseTCR,
    handleUpdateStatus,
    registry,
    listingType,
    updateTrigger,
    revealTrigger,
    tokenData,
  } = props

  return (
    <div>
      <Card className={classes.card}>
        <Img src={tokenData ? tokenData.imgSrc : imgSrc} alt="" />

        <CardContent>
          <Typography variant="title" component="h3">
            {tokenData ? (tokenData.name ? tokenData.name : one.listingID) : one.listingID}
          </Typography>

          <Typography component="p">{`BY: ${one.owner.substring(0, 10)}`}</Typography>
          <Typography component="p">{one.appExpiry.formattedLocal}</Typography>
        </CardContent>

        <CardActions>
          <div>
            {listingType === 'faceoffs' ? (
              <div>
                {!revealTrigger && !updateTrigger ? (
                  <div>
                    <Button
                      onClick={e => openSidePanel(one, 'commitVote')}
                      size="medium"
                      color="primary"
                    >
                      {'Commit Vote'}
                    </Button>
                    <Countdown end={one.commitExpiry.date} />
                  </div>
                ) : (
                  revealTrigger &&
                  !updateTrigger && (
                    <div>
                      <Button
                        onClick={e => openSidePanel(one, 'revealVote')}
                        size="medium"
                        color="primary"
                      >
                        {'Reveal Vote'}
                      </Button>
                      <Countdown end={one.revealExpiry.date} />
                    </div>
                  )
                )}
              </div>
            ) : (
              <div>
                <Button
                  onClick={e => openSidePanel(one, 'challenge')}
                  size="medium"
                  color="primary"
                >
                  {'Challenge'}
                </Button>
                <Countdown end={one.appExpiry.date} />
              </div>
            )}
            {registry && registry.address === '0x9fc1917a8ba87db75e308c9de45d99813f63e64a' ? (
              <Button onClick={e => chooseTCR(one.listingID)}>{'Select TCR'}</Button>
            ) : (
              updateTrigger && (
                <div>
                  <Button onClick={e => handleUpdateStatus(one)} size="medium" color="primary">
                    {'Update Status'}
                  </Button>
                </div>
              )
            )}
          </div>
        </CardActions>
      </Card>
    </div>
  )
}

export default withStyles(styles)(ListingCard)
